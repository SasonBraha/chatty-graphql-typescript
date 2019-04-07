import {
	Resolver,
	Mutation,
	Arg,
	Ctx,
	Query,
	FieldResolver,
	Root,
	Subscription,
	PubSub,
	PubSubEngine
} from 'type-graphql';
import User, { UserEntity, IUser } from '../models/User.model';
import Chat, { ChatEntity, IChat } from '../models/Chat.model';
import { CreateChatInput, RegisterInput, LoginInput } from './inputs';
import * as uuid from 'uuid';
import Message, { MessageEntity, IMessage } from '../models/Message.model';
import { Request } from 'express';
import generateJWT from '../auth/generateJWT';
import { ObjectID } from 'bson';
import activeUsers from '../redis/services/ActiveUsers.service';

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	USER_JOINED = 'USER_JOINED'
}

@Resolver(UserEntity)
class UserResolver {
	@Mutation(returns => Boolean)
	async register(
		@Arg('data') { displayName, email, password }: RegisterInput,
		@Ctx('req') req: Request
	): Promise<boolean> {
		try {
			await User.create({
				displayName,
				email,
				password,
				slug: `${displayName}@${uuid()}`,
				jwtId: uuid(),
				ipAddress:
					req.headers['x-forwarded-for'] || req.connection.remoteAddress
			});
			return true;
		} catch (ex) {
			return false;
		}
	}

	@Mutation(returns => String, { nullable: true })
	async login(@Arg('data') { email, password }: LoginInput): Promise<string> {
		try {
			const user = await User.findOne({ email });
			if (!user) return null;

			const isPasswordMatch = await user.comparePassword(password);
			if (!isPasswordMatch) return null;

			return generateJWT(user);
		} catch (ex) {
			return null;
		}
	}
}

@Resolver(ChatEntity)
export class ChatResolver {
	@Query(returns => ChatEntity)
	async chat(
		@Arg('chatSlug') chatSlug: string,
		@Arg('isJoining') isJoining: boolean,
		@Ctx('user') user: IUser,
		@PubSub() pubSub: PubSubEngine
	): Promise<IChat> {
		if (isJoining) {
			const userList = await activeUsers.addUser(chatSlug, user);
			pubSub.publish(SubscriptionTypesEnum.USER_JOINED, {
				chatSlug,
				userList
			});
		}
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
		defaultValue: null,
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	userJoined(
		@Root() activeUsers: { chatSlug: string; userList: IUser[] },
		@Arg('chatSlug') chatSlug: string
	): IUser[] {
		return activeUsers.userList;
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
