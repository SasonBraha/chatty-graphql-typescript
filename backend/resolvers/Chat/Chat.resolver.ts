import {
	Arg,
	Ctx,
	FieldResolver,
	Int,
	Mutation,
	PubSub,
	PubSubEngine,
	Query,
	Resolver,
	Root,
	Subscription,
	UseMiddleware
} from 'type-graphql';
import { Chat } from '../../entities/Chat';
import { User } from '../../entities/User';
import { Message } from '../../entities/Message';
import {
	CreateChatInput,
	IFileInput,
	UpdateMessageInput
} from './chat.resolver.inputs';
import { GraphQLUpload } from 'apollo-server-express';
import { Authenticated, WithPermission } from '../../middlewares';
import { ChatPermissionTypesEnum } from '../../permissions';
import withPermission from '../../middlewares/WithPermission';
import {
	ChatUpdatesUnion,
	MessageConnection,
	UserTypingOutput
} from './chat.resolver.output';
import { SubscriptionTypesEnum } from '../../types/enums';
import { Document } from 'mongoose';
import ChatService from '../../services/ChatService';
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';

@Resolver(Chat)
export default class ChatResolver {
	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([ChatPermissionTypesEnum.VIEW_CHAT]))
	@Query(returns => Chat)
	async chat(
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: User
	): Promise<Chat> {
		return ChatService.getChatForUser(chatSlug, user);
	}

	@UseMiddleware(Authenticated)
	@Query(returns => [Chat])
	async roomsList(@Ctx('user') user: User): Promise<Chat[]> {
		return ChatService.listRoomsForUser(user);
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([ChatPermissionTypesEnum.CREATE_CHAT]))
	@Mutation(returns => Chat)
	async createChatRoom(
		@Arg('data') { name, isPrivate, storeMessages }: CreateChatInput,
		@Ctx('user') user: User
	): Promise<Chat> {
		return ChatService.createChatRoom({ name, isPrivate, storeMessages }, user);
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(withPermission([ChatPermissionTypesEnum.POST_MESSAGE]))
	@Mutation(returns => Message, { nullable: true })
	async postMessage(
		@Arg('text') text: string,
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: User,
		@PubSub() pubSub: PubSubEngine
	): Promise<Message | { _id: string }> {
		return ChatService.postMessage(text, chatSlug, user, pubSub);
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
		@Ctx('user') user: User & Document,
		@PubSub() pubSub: PubSubEngine
	): Promise<boolean> {
		return ChatService.updateMessage(updatePayload, user, pubSub);
	}

	@UseMiddleware(Authenticated)
	@Mutation(returns => Boolean)
	async uploadMessageFile(
		@Arg('file', () => GraphQLUpload) file: IFileInput,
		@Arg('chatSlug') chatSlug: string,
		@Arg('messageId') messageId: string,
		@Ctx('user') user: User,
		@PubSub() pubSub: PubSubEngine
	): Promise<boolean> {
		return ChatService.uploadMessageFile(file, chatSlug, messageId, user, pubSub);
	}

	@UseMiddleware(Authenticated)
	@Mutation(returns => Boolean, { nullable: true })
	async updateActiveUsers(
		@Arg('chatSlug') chatSlug: string,
		@Arg('crudType') crudType: string,
		@Ctx('user') user: User,
		@PubSub() pubSub: PubSubEngine
	): Promise<void> {
		return ChatService.updateActiveUsers(chatSlug, crudType, user, pubSub);
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(withPermission([ChatPermissionTypesEnum.POST_MESSAGE]))
	@Mutation(returns => Boolean, { nullable: true })
	updateTypingUsers(
		@Arg('chatSlug') chatSlug: string,
		@Arg('crudType') crudType: string,
		@Ctx('user') user: User,
		@PubSub() pubSub: PubSubEngine
	) {
		return ChatService.updateTypingUsers(chatSlug, crudType, user, pubSub);
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(withPermission([ChatPermissionTypesEnum.VIEW_CHAT]))
	@Subscription(returns => [User], {
		topics: SubscriptionTypesEnum.UPDATE_ACTIVE_USERS,
		defaultValue: [],
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	onActiveUsersUpdate(
		@Root()
		payloadData: { chatSlug: string; userList: User[]; crudType: string },
		@Arg('chatSlug') chatSlug: string
	): User[] {
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
	@Subscription(returns => ChatUpdatesUnion, {
		topics: [
			SubscriptionTypesEnum.NEW_MESSAGE,
			SubscriptionTypesEnum.FILE_UPLOADED,
			SubscriptionTypesEnum.MESSAGE_DELETED,
			SubscriptionTypesEnum.MESSAGE_EDITED
		],
		filter: ({ payload, args }) => payload.chatSlug === args.chatSlug
	})
	onMessageUpdate(
		@Root() subscriptionPayload: any,
		@Arg('chatSlug') chatSlug: string
	): typeof ChatUpdatesUnion {
		// FIXME Sason - Figure out why apollo converts createdAt(Date type) to null in { NEW_MESSAGE } response
		return subscriptionPayload.payload;
	}

	@UseMiddleware(Authenticated)
	@Subscription(returns => UserTypingOutput, {
		topics: SubscriptionTypesEnum.UPDATE_TYPING_USERS,
		defaultValue: null,
		filter: ({ payload, context }) => payload.user.slug !== context.user.slug
	})
	onTypingUsersUpdate(@Root()
	payloadData: {
		chatSlug: string;
		user: User;
		crudType: string;
	}) {
		return payloadData;
	}

	@FieldResolver()
	async createdBy(@Root() chat: Chat): Promise<User> {
		return UserService.getUserById(chat.createdBy.toString());
	}

	@FieldResolver()
	async messages(
		@Root() chat: Chat,
		@Arg('first', () => Int, { nullable: true }) first: number,
		@Arg('last', () => Int, { nullable: true }) last: number,
		@Arg('after', { nullable: true }) after: string,
		@Arg('before', { nullable: true }) before: string
	): Promise<MessageConnection> {
		return MessageService.getMessagesForChat(chat, first, last, after, before);
	}
}
