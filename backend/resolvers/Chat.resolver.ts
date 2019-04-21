import {
	Arg,
	Ctx,
	FieldResolver,
	Mutation,
	PubSub,
	PubSubEngine,
	Query,
	Resolver,
	Root,
	Subscription,
	UseMiddleware
} from 'type-graphql';
import Chat, { ChatEntity, IChat } from '../models/Chat.model';
import User, { IUser, UserEntity } from '../models/User.model';
import Message, { IMessage, MessageEntity } from '../models/Message.model';
import { ObjectID } from 'bson';
import { CreateChatInput, IFileInput } from './inputs';
import activeUsersService from '../redis/services/ActiveUsers.service';
import * as uuid from 'uuid';
import { GraphQLUpload } from 'apollo-server-express';
import { uploadFile } from '../utils/files';
import { translate } from '../utils';
import { ErrorTypesEnum } from '../utils/errors';
import { Authenticated, WithPermission } from '../middlewares';
import { ChatPermissionTypesEnum } from '../permissions';
import withPermission from '../middlewares/WithPermission';

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	USER_JOINED = 'USER_JOINED',
	FILE_UPLOADED = 'FILE_UPLOADED'
}

@Resolver(ChatEntity)
export default class ChatResolver {
	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission(ChatPermissionTypesEnum.VIEW_CHAT))
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
		@Arg('beforeMessageId') beforeMessageId: string,
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
	@UseMiddleware(WithPermission(ChatPermissionTypesEnum.CREATE_CHAT))
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
	@UseMiddleware(withPermission(ChatPermissionTypesEnum.POST_MESSAGE))
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
			createdBy: {
				_id,
				displayName,
				slug,
				avatar
			}
		};

		// Emit New Message
		pubSub.publish(SubscriptionTypesEnum.NEW_MESSAGE, {
			...messageData,
			createdAt: new Date(),
			chatSlug
		});

		// Create New Message
		const newMessage = await Message.create(messageData);

		// Save Message Id To Chat
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
			path: fileData.path,
			messageId
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
		@Root() messagePayload: IMessage,
		@Arg('chatSlug') chatSlug: string,
		@Ctx('ctx') ctx
	): IMessage {
		return messagePayload;
	}

	@Subscription(returns => String, {
		topics: SubscriptionTypesEnum.FILE_UPLOADED,
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	fileUploaded(
		@Root() fileData: { path: string; chatSlug: string; messageId: string },
		@Arg('chatSlug') chatSlug: string,
		@Ctx('ctx') ctx
	) {
		return JSON.stringify({
			chatSlug,
			messageId: fileData.messageId,
			path: fileData.path
		});
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
