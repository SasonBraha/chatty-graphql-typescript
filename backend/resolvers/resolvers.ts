import {
	Resolver,
	Mutation,
	Arg,
	Ctx,
	Query,
	FieldResolver,
	Root
} from 'type-graphql';
import User, { UserEntity, IUser } from '../models/User.model';
import Chat, { ChatEntity, IChat } from '../models/Chat.model';
import { CreateChatInput, RegisterInput, LoginInput } from './inputs';
import * as uuid from 'uuid';
import Message, { MessageEntity, IMessage } from '../models/Message.model';
import { Request } from 'express';
import generateJWT from '../auth/generateJWT';

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
		@Arg('chatId') chatId: string,
		@Ctx('user') user: IUser
	): Promise<IMessage> {
		const { _id, displayName, slug } = user;

		// Create New Message
		const newMessage = await Message.create({
			text,
			createdBy: {
				_id,
				displayName,
				slug
			}
		});

		// Save Message Id To Chat
		await Chat.update(
			{ _id: chatId },
			{
				$push: { messages: newMessage._id },
				$set: { lastMessage: newMessage.text }
			}
		);

		return newMessage;
	}

	@FieldResolver()
	async admin(@Root() chat: IChat): Promise<IUser> {
		return await User.findById(chat.admin);
	}

	@FieldResolver()
	async messages(@Root() chat: IChat): Promise<IMessage[]> {
		const populatedChat = await Chat.findById(chat._id)
			.populate({
				path: 'messages',
				model: 'Message'
			})
			.lean();

		return populatedChat.messages;
	}
}
