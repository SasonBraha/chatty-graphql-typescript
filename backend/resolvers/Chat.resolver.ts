import {
	Arg,
	Ctx,
	FieldResolver,
	Mutation,
	PubSub,
	Query,
	Resolver,
	Root,
	Subscription,
	PubSubEngine
} from 'type-graphql';
import Chat, { ChatEntity, IChat } from '../models/Chat.model';
import User, { IUser, UserEntity } from '../models/User.model';
import Message, { IMessage, MessageEntity } from '../models/Message.model';
import { ObjectID } from 'bson';
import { CreateChatInput, IFileInput } from './inputs';
import activeUsersService from '../redis/services/ActiveUsers.service';
import * as uuid from 'uuid';
import { GraphQLUpload } from 'apollo-server-express';
import { createBufferFromStream, uploadFile } from '../utils/files';

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	USER_JOINED = 'USER_JOINED'
}

@Resolver(ChatEntity)
export default class ChatResolver {
	@Query(returns => ChatEntity)
	async chat(
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser
	): Promise<IChat> {
		return await Chat.findOne({ slug: chatSlug }).lean();
	}

	@Query(returns => [MessageEntity], { nullable: true })
	async olderMessages(
		@Arg('beforeMessageId') beforeMessageId: string,
		@Arg('chatSlug') chatSlug: string
	): Promise<IMessage[]> {
		// FIXME - Use pipelines
		const oldMessages = await Chat.aggregate([
			{ $match: { slug: chatSlug } },
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

		return oldMessages.length ? oldMessages[0].messages.reverse() : [];
	}

	@Query(returns => [ChatEntity])
	async roomsList(): Promise<IChat[]> {
		return await Chat.find();
	}

	@Mutation(returns => ChatEntity)
	async createChat(
		@Arg('data') { name, isPrivate, storeMessages }: CreateChatInput,
		@Ctx('user') user: IUser
	): Promise<IChat> {
		const newChatRoom = await Chat.create({
			name,
			image: {
				path: '/images/default_chat.svg',
				isStored: false
			},
			isPrivate,
			storeMessages,
			admin: user._id,
			slug: `${name}@${uuid()}`
		});

		return newChatRoom;
	}

	@Mutation(returns => MessageEntity)
	async postMessage(
		@Arg('text') text: string,
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<IMessage> {
		const { _id, displayName, slug, avatar } = user;
		const messageData = {
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
			_id: uuid(),
			createdAt: new Date(),
			chatSlug
		});

		// Create New Message
		const newMessage = await Message.create(messageData);

		// Save Message Id To Chat
		await Chat.updateOne(
			{ slug: chatSlug },
			{
				$push: { messages: newMessage._id },
				$set: { lastMessage: newMessage.text }
			}
		);

		return newMessage;
	}

	@Mutation(returns => String)
	async uploadMessageFile(
		@Arg('file', () => GraphQLUpload) file: IFileInput,
		@Ctx('user') user: IUser
	): Promise<string> {
		console.log(await uploadFile(file));
		return '';
	}

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
