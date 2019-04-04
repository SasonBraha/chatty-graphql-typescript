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
import { CreateChatInput } from './inputs';
import * as uuid from 'uuid';
import Message, { MessageEntity, IMessage } from '../models/Message.model';

@Resolver(UserEntity)
class UserResolver {}

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
