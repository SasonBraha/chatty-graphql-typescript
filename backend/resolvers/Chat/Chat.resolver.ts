import {
	Arg,
	Ctx,
	FieldResolver,
	ID,
	Mutation,
	PubSub,
	PubSubEngine,
	Query,
	Resolver,
	Root,
	Subscription,
	UseMiddleware
} from 'type-graphql';
import Chat, { ChatEntity, IChat } from '../../models/Chat.model';
import User, {
	IUser,
	IUserSchemaMethods,
	UserEntity
} from '../../models/User.model';
import Message, { IMessage, MessageEntity } from '../../models/Message.model';
import { ObjectID } from 'bson';
import { CreateChatInput, IFileInput } from './chat.resolver.inputs';
import activeUsersService from '../../redis/services/ActiveUsers.service';
import * as uuid from 'uuid';
import { GraphQLUpload } from 'apollo-server-express';
import { uploadFile } from '../../utils/files';
import { translate } from '../../utils';
import { ErrorTypesEnum } from '../../utils/errors';

import { Authenticated, WithPermission } from '../../middlewares';
import { ChatPermissionTypesEnum } from '../../permissions';
import withPermission from '../../middlewares/WithPermission';
import {
	IMessageCreatedOutput,
	IMessageDeletedOutput,
	IMessageFileUploadedOutput,
	UserTypingOutput
} from './chat.resolver.output';
import { UpdateMessageInput } from './chat.resolver.inputs';
import { CrudEnum } from '../../types/enums';

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	FILE_UPLOADED = 'FILE_UPLOADED',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	MESSAGE_EDITED = 'MESSAGE_EDITED',
	UPDATE_TYPING_USERS = 'UPDATE_TYPING_USERS',
	UPDATE_ACTIVE_USERS = 'UPDATE_ACTIVE_USERS'
}

@Resolver(ChatEntity)
export default class ChatResolver {
	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([ChatPermissionTypesEnum.VIEW_CHAT]))
	@Query(returns => ChatEntity)
	async chat(
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser
	): Promise<IChat> {
		const chat = await Chat.findOne({
			$or: [
				{ slug: chatSlug, isPrivate: false },
				{
					slug: chatSlug,
					isPrivate: true,
					allowedUsers: user._id
				}
			]
		}).lean();

		if (!chat) {
			throw new Error(ErrorTypesEnum.NOT_FOUND);
		}

		return chat;
	}

	@UseMiddleware(Authenticated)
	@Query(returns => [MessageEntity], { nullable: true })
	async olderMessages(
		@Arg('beforeMessageId', () => ID) beforeMessageId: string,
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser
	): Promise<IMessage[]> {
		try {
			const fromChat = await Chat.findOne({
				$or: [
					{ slug: chatSlug, isPrivate: false },
					{
						slug: chatSlug,
						isPrivate: true,
						allowedUsers: user._id
					}
				]
			});

			if (fromChat) {
				const olderMessages = await Message.aggregate([
					{ $match: { _id: { $lt: new ObjectID(beforeMessageId) }, chatSlug } },
					{ $sort: { createdAt: -1 } },
					{ $limit: 20 }
				]);
				return olderMessages;
			} else {
				throw new Error(ErrorTypesEnum.NOT_FOUND);
			}
		} catch (ex) {
			throw new Error(ErrorTypesEnum.INTERNAL_SERVER_ERROR);
		}
	}

	@UseMiddleware(Authenticated)
	@Query(returns => [ChatEntity])
	async roomsList(@Ctx('user') user: IUser): Promise<IChat[]> {
		return await Chat.find({
			$or: [
				{ isPrivate: false },
				{
					isPrivate: true,
					allowedUsers: user._id
				}
			]
		});
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([ChatPermissionTypesEnum.CREATE_CHAT]))
	@Mutation(returns => ChatEntity)
	async createChat(
		@Arg('data') { name, isPrivate, storeMessages }: CreateChatInput,
		@Ctx('user') user: IUser
	): Promise<IChat> {
		return await Chat.create({
			name,
			image: {
				path: '/images/default_chat.svg',
				isStored: false
			},
			isPrivate,
			storeMessages,
			admin: user._id,
			slug: `${await translate(name)}@${uuid()}`
		});
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(withPermission([ChatPermissionTypesEnum.POST_MESSAGE]))
	@Mutation(returns => MessageEntity)
	async postMessage(
		@Arg('text') text: string,
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<IMessage> {
		const mentionUserRegex = new RegExp('(@[\\wא-ת-]+)', 'g');
		const mentions = text.match(mentionUserRegex);
		if (mentions) {
			const mentionsData = mentions.reduce((acc, currentMention) => {
				const startIndex = text.indexOf(currentMention);
				const endIndex = startIndex + currentMention.length;

				acc.push({
					indices: [startIndex, endIndex],
					username: currentMention.slice(1)
				});
				return acc;
			}, []);

			console.log(mentionsData);
		}

		const preSaveId = new Message();
		const { _id, displayName, slug, avatar } = user;
		const messageData = {
			_id: preSaveId._id,
			text,
			chatSlug,
			file: null,
			createdBy: {
				_id,
				displayName,
				slug,
				avatar
			}
		};

		// Emit New Message
		pubSub.publish(SubscriptionTypesEnum.NEW_MESSAGE, {
			message: {
				...messageData,
				createdAt: new Date(),
				isClientDeleted: null
			},
			updateType: SubscriptionTypesEnum.NEW_MESSAGE,
			chatSlug
		});

		const newMessage = await Message.create(messageData);
		await Chat.updateOne(
			{
				$or: [
					{ slug: chatSlug, isPrivate: false },
					{
						slug: chatSlug,
						isPrivate: true,
						allowedUsers: user._id
					}
				]
			},
			{
				$set: { lastMessage: newMessage.text }
			}
		);

		return newMessage;
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(
		withPermission([
			ChatPermissionTypesEnum.EDIT_OWN_MESSAGE,
			ChatPermissionTypesEnum.EDIT_MESSAGE,
			ChatPermissionTypesEnum.DELETE_OWN_MESSAGE,
			ChatPermissionTypesEnum.DELETE_MESSAGE
		])
	)
	@Mutation(returns => Boolean)
	async updateMessage(
		@Arg('updatePayload') updatePayload: UpdateMessageInput,
		@Ctx('user') user: IUserSchemaMethods,
		@PubSub() pubSub: PubSubEngine
	): Promise<boolean> {
		const { messageId, crudType } = updatePayload;
		const targetMessage = await Message.findOne({ _id: messageId });

		if (targetMessage) {
			const isUserCreatedTargetMessage =
				targetMessage.createdBy._id === user._id.toString();
			switch (crudType) {
				case CrudEnum.DELETE:
					if (
						user.hasPermission([ChatPermissionTypesEnum.DELETE_MESSAGE]) ||
						isUserCreatedTargetMessage
					) {
						await targetMessage.remove();

						pubSub.publish(SubscriptionTypesEnum.MESSAGE_DELETED, {
							messageId,
							chatSlug: targetMessage.chatSlug,
							updateType: SubscriptionTypesEnum.MESSAGE_DELETED
						});
					}
					return true;

				case CrudEnum.UPDATE:
					if (
						user.hasPermission([ChatPermissionTypesEnum.EDIT_MESSAGE]) ||
						isUserCreatedTargetMessage
					) {
						targetMessage.text = updatePayload.messageText!;
						await targetMessage.save();

						pubSub.publish(SubscriptionTypesEnum.MESSAGE_EDITED, {
							chatSlug: targetMessage.chatSlug,
							updatedText: targetMessage.text,
							updateType: SubscriptionTypesEnum.MESSAGE_EDITED,
							messageId
						});
					}
					return true;
			}
		} else {
			throw new Error(ErrorTypesEnum.NOT_FOUND);
		}
	}

	@UseMiddleware(Authenticated)
	@Mutation(returns => Boolean)
	async uploadMessageFile(
		@Arg('file', () => GraphQLUpload) file: IFileInput,
		@Arg('chatSlug') chatSlug: string,
		@Arg('messageId') messageId: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<boolean> {
		const fileData = await uploadFile(file, chatSlug);

		pubSub.publish(SubscriptionTypesEnum.FILE_UPLOADED, {
			chatSlug,
			messageId,
			file: fileData,
			updateType: SubscriptionTypesEnum.FILE_UPLOADED
		});

		await Message.updateOne(
			{
				_id: messageId,
				'createdBy._id': user._id
			},
			{
				$set: { file: fileData }
			}
		);

		return true;
	}

	@UseMiddleware(Authenticated)
	@Mutation(returns => Boolean, { nullable: true })
	async updateActiveUsers(
		@Arg('chatSlug') chatSlug: string,
		@Arg('crudType') crudType: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<void> {
		let userList: IUser[] = null;

		switch (crudType) {
			case CrudEnum.UPDATE:
				userList = await activeUsersService.addUser(chatSlug, user);
				break;

			case CrudEnum.DELETE:
				userList = await activeUsersService.removeUser(chatSlug, user);
				break;
		}

		pubSub.publish(SubscriptionTypesEnum.UPDATE_ACTIVE_USERS, {
			userList,
			chatSlug,
			crudType
		});
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(withPermission([ChatPermissionTypesEnum.POST_MESSAGE]))
	@Mutation(returns => Boolean, { nullable: true })
	updateTypingUsers(
		@Arg('chatSlug') chatSlug: string,
		@Arg('crudType') crudType: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	) {
		pubSub.publish(SubscriptionTypesEnum.UPDATE_TYPING_USERS, {
			chatSlug,
			crudType,
			user: {
				displayName: user.displayName,
				slug: user.slug
			}
		});
		return true;
	}

	@UseMiddleware(Authenticated)
	@Subscription(returns => MessageEntity, {
		topics: SubscriptionTypesEnum.NEW_MESSAGE,
		defaultValue: null,
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	newMessage(
		@Root() messagePayload: { message: IMessage },
		@Arg('chatSlug') chatSlug: string,
		@Ctx('ctx') ctx
	): IMessage {
		return messagePayload.message;
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(withPermission([ChatPermissionTypesEnum.VIEW_CHAT]))
	@Subscription(returns => [UserEntity], {
		topics: SubscriptionTypesEnum.UPDATE_ACTIVE_USERS,
		defaultValue: [],
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	subscribeToActiveUsersUpdates(
		@Root()
		payloadData: { chatSlug: string; userList: IUser[]; crudType: string },
		@Arg('chatSlug') chatSlug: string
	): IUser[] {
		return payloadData.userList;
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(
		withPermission([
			ChatPermissionTypesEnum.EDIT_OWN_MESSAGE,
			ChatPermissionTypesEnum.EDIT_MESSAGE,
			ChatPermissionTypesEnum.DELETE_OWN_MESSAGE,
			ChatPermissionTypesEnum.DELETE_MESSAGE
		])
	)
	@Subscription(returns => String, {
		topics: [
			SubscriptionTypesEnum.NEW_MESSAGE,
			SubscriptionTypesEnum.FILE_UPLOADED,
			SubscriptionTypesEnum.MESSAGE_DELETED,
			SubscriptionTypesEnum.MESSAGE_EDITED
		],
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	messagesUpdates(
		@Root()
		subscriptionPayload:
			| IMessageCreatedOutput
			| IMessageDeletedOutput
			| IMessageFileUploadedOutput,
		@Arg('chatSlug') chatSlug: string
	): string {
		return JSON.stringify(subscriptionPayload);
	}

	//prettier-ignore
	@UseMiddleware(Authenticated)
	@Subscription(returns => UserTypingOutput, {
		topics: SubscriptionTypesEnum.UPDATE_TYPING_USERS,
		defaultValue: null,
		filter: ({ payload, context }) => payload.user.slug !== context.user.slug
	})
	subscribeToTypingUsersUpdates(
		@Root() payloadData: { chatSlug: string; user: IUser; crudType: string },
	) {
		return payloadData;
	}

	@FieldResolver()
	async admin(@Root() chat: IChat): Promise<IUser> {
		return await User.findById(chat.admin);
	}

	@FieldResolver()
	async messages(@Root() chat: IChat): Promise<IMessage[]> {
		const messages = await Message.find({
			chatSlug: chat.slug
		})
			.limit(20)
			.sort({ createdAt: 'desc' });

		return messages.reverse();
	}
}
