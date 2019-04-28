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
import { CreateChatInput, IFileInput } from '../inputs';
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
	IMessageFileUploadedOutput
} from './chat.resolver.output';
import { UpdateMessageInput } from './chat.resolver.inputs';
import { CrudEnum } from '../../types/enums';
import { Promise } from 'mongoose';

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	USER_JOINED = 'USER_JOINED',
	FILE_UPLOADED = 'FILE_UPLOADED',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	MESSAGE_EDITED = 'MESSAGE_EDITED'
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
		// FIXME - Use pipelines
		try {
			const oldMessages = await Chat.aggregate([
				{
					$match: {
						$or: [
							{ slug: chatSlug, isPrivate: false },
							{
								slug: chatSlug,
								isPrivate: true,
								allowedUsers: user._id
							}
						]
					}
				},
				{
					$lookup: {
						from: 'messages',
						localField: 'messages',
						foreignField: '_id',
						as: 'messages'
					}
				},
				{ $unwind: '$messages' },
				{ $match: { 'messages._id': { $lt: new ObjectID(beforeMessageId) } } },
				{ $sort: { 'messages.createdAt': -1 } },
				{ $limit: 20 },
				{ $group: { _id: '$_id', messages: { $push: '$messages' } } }
			]);

			return oldMessages.length ? oldMessages[0].messages : [];
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
				$push: { messages: newMessage._id },
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
						await Promise.all([
							Chat.updateOne(
								{ slug: targetMessage.chatSlug },
								{
									$pull: { messages: messageId }
								}
							),
							targetMessage.remove()
						]);

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
	async addActiveUser(
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<void> {
		const userList = await activeUsersService.addUser(chatSlug, user);
		pubSub.publish(SubscriptionTypesEnum.USER_JOINED, {
			userList,
			chatSlug
		});
	}

	@UseMiddleware(Authenticated)
	@Mutation(returns => Boolean, { nullable: true })
	async removeActiveUser(
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<void> {
		const userList = await activeUsersService.removeUser(chatSlug, user);
		pubSub.publish(SubscriptionTypesEnum.USER_JOINED, {
			userList,
			chatSlug
		});
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

	@Subscription(returns => [UserEntity], {
		topics: SubscriptionTypesEnum.USER_JOINED,
		defaultValue: [],
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	activeUsers(
		@Root() payloadData: { chatSlug: string; userList: IUser[] },
		@Arg('chatSlug') chatSlug: string
	): IUser[] {
		return payloadData.userList;
	}

	@UseMiddleware(Authenticated)
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

	@FieldResolver()
	async admin(@Root() chat: IChat): Promise<IUser> {
		return await User.findById(chat.admin);
	}

	@FieldResolver()
	async messages(@Root() chat: IChat): Promise<IMessage[]> {
		const populatedChat = await Chat.findOne(
			{ slug: chat.slug },
			{ messages: { $slice: -20 } }
		)
			.populate({
				path: 'messages',
				model: 'Message'
			})
			.lean();

		return populatedChat.messages;
	}
}
