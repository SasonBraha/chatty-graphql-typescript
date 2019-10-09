import {
	Arg,
	Ctx,
	FieldResolver,
	ID,
	Info,
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
import { Chat, ChatModel } from '../../entities/Chat';
import { User, UserModel } from '../../entities/User';
import { NotificationModel } from '../../entities/Notification';
import { Message, MessageModel } from '../../entities/Message';
import { Mention } from '../../entities/Mention';
import { ObjectID } from 'bson';
import {
	CreateChatInput,
	IFileInput,
	UpdateMessageInput
} from './chat.resolver.inputs';
import activeUsersService from '../../redis/services/ActiveUsers.service';
import * as uuid from 'uuid';
import { GraphQLUpload } from 'apollo-server-express';
import { uploadFile } from '../../utils/files';
import { ErrorTypesEnum } from '../../utils/errors';
import { Authenticated, WithPermission } from '../../middlewares';
import { ChatPermissionTypesEnum } from '../../permissions';
import withPermission from '../../middlewares/WithPermission';
import {
	ChatUpdatesUnion,
	MessageConnection,
	UserTypingOutput
} from './chat.resolver.output';
import {
	CrudEnum,
	SubscriptionTypesEnum,
	UserUpdatesEnum
} from '../../types/enums';
import { generateUserMentionedNotification } from '../../utils/notifications';
import * as jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import * as graphqlFields from 'graphql-fields';
import sanitizer from '../../services/Sanitizer';

@Resolver(Chat)
export default class ChatResolver {
	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([ChatPermissionTypesEnum.VIEW_CHAT]))
	@Query(returns => Chat)
	async chat(
		@Arg('chatSlug') chatSlug: string,
		@Ctx('user') user: User
	): Promise<Chat> {
		const chat = await ChatModel.findOne({
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
	@Query(returns => [Chat])
	async roomsList(@Ctx('user') user: User): Promise<Chat[]> {
		return await ChatModel.find({
			$or: [
				{ isPrivate: false },
				{
					isPrivate: true,
					allowedUsers: user._id
				}
			]
		}).sort({ updatedAt: -1 });
	}

	@UseMiddleware(Authenticated)
	@UseMiddleware(WithPermission([ChatPermissionTypesEnum.CREATE_CHAT]))
	@Mutation(returns => Chat)
	async createChatRoom(
		@Arg('data') { name, isPrivate, storeMessages }: CreateChatInput,
		@Ctx('user') user: User
	): Promise<Chat> {
		return await ChatModel.create({
			name,
			image: {
				path: '/images/default_chat.svg',
				isStored: false
			},
			isPrivate,
			storeMessages,
			createdBy: user._id,
			slug: `${name}@${uuid()}`
		});
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
		const mentionUserRegex = new RegExp('(@[\\wא-ת-_]+)', 'g');
		const mentions = text.match(mentionUserRegex);
		let userMentions: Mention[] = [];
		let usersData: User[] = [];

		if (mentions) {
			const usernames = mentions.map(mention => mention.slice(1));
			usersData = await UserModel.find({
				displayName: { $in: usernames }
			}).select('displayName _id slug');

			if (usersData.length) {
				userMentions = usersData.reduce((acc: Mention[], currentUser: User) => {
					const { displayName, slug, _id } = currentUser;
					const startIndex = text.indexOf(displayName) - 1;
					const endIndex = startIndex + displayName.length + 1;

					acc.push({
						indices: [startIndex, endIndex],
						displayName,
						slug,
						_id
					});

					return acc;
				}, []);
			}
		}

		const preSaveId = new MessageModel();
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
			},
			userMentions
		};

		await pubSub.publish(SubscriptionTypesEnum.NEW_MESSAGE, {
			payload: {
				message: {
					cursor: messageData._id,
					node: {
						...messageData,
						createdAt: new Date().toISOString(),
						creationToken: jwt.sign(
							{ userId: user._id.toString(), messageId: preSaveId._id },
							process.env.JWT_SECRET
						),
						file: null
					}
				},
				updateType: SubscriptionTypesEnum.NEW_MESSAGE
			},
			chatSlug
		});

		const targetChatRoom = await ChatModel.findOne({
			$or: [
				{ slug: chatSlug, isPrivate: false, storeMessages: true },
				{
					slug: chatSlug,
					isPrivate: true,
					storeMessages: true,
					allowedUsers: user._id
				}
			]
		});

		let newMessage: Message = null;
		if (targetChatRoom && targetChatRoom.storeMessages) {
			newMessage = await MessageModel.create(messageData);
			targetChatRoom.lastMessage = newMessage.text;
			await targetChatRoom.save();

			usersData.forEach(async ({ _id }) => {
				if (user._id.toString() !== _id.toString()) {
					const notification = await NotificationModel.create(
						generateUserMentionedNotification(
							(user._id as unknown) as string,
							(_id as unknown) as string,
							`${chatSlug}/${newMessage._id}`
						)
					);

					pubSub.publish(SubscriptionTypesEnum.USER_MENTIONED, {
						notification,
						userId: _id,
						type: UserUpdatesEnum.NEW_NOTIFICATION
					});
				}
			});
		}

		return newMessage
			? newMessage
			: { _id: (preSaveId._id as unknown) as string };
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
		const { messageId, creationToken, crudType, chatSlug } = updatePayload;
		const targetMessage = await MessageModel.findOne({ _id: messageId });
		let isUserCreatedTargetMessage: boolean = false;
		let shouldUpdateDB: boolean = false;

		if (!targetMessage && creationToken) {
			// @ts-ignore
			const creationTokenData: { userId; messageId } = await jwt.verify(
				creationToken,
				process.env.JWT_SECRET
			);

			if (creationTokenData) {
				isUserCreatedTargetMessage =
					creationTokenData.userId === user._id.toString() &&
					messageId === creationTokenData.messageId;
				shouldUpdateDB = false;
			}
		} else if (targetMessage) {
			isUserCreatedTargetMessage =
				targetMessage.createdBy._id.toString() === user._id.toString();
			shouldUpdateDB = true;
		}

		switch (crudType) {
			case CrudEnum.DELETE:
				if (
					user.hasPermission([ChatPermissionTypesEnum.DELETE_MESSAGE]) ||
					isUserCreatedTargetMessage
				) {
					await pubSub.publish(SubscriptionTypesEnum.MESSAGE_DELETED, {
						payload: {
							updateType: SubscriptionTypesEnum.MESSAGE_DELETED,
							messageId
						},
						chatSlug: chatSlug
					});

					if (shouldUpdateDB) {
						await targetMessage.remove();
					}
				}
				return true;

			case CrudEnum.UPDATE:
				if (
					user.hasPermission([ChatPermissionTypesEnum.EDIT_MESSAGE]) ||
					isUserCreatedTargetMessage
				) {
					const sanitizedText = sanitizer.html(updatePayload.messageText);
					await pubSub.publish(SubscriptionTypesEnum.MESSAGE_EDITED, {
						payload: {
							updatedText: sanitizedText,
							updateType: SubscriptionTypesEnum.MESSAGE_EDITED,
							messageId
						},
						chatSlug: chatSlug
					});

					if (shouldUpdateDB) {
						targetMessage.text = sanitizedText;
						await targetMessage.save();
					}
				}
				return true;
		}
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
		const fileData = await uploadFile(file, chatSlug);

		pubSub.publish(SubscriptionTypesEnum.FILE_UPLOADED, {
			payload: {
				messageId,
				file: fileData,
				updateType: SubscriptionTypesEnum.FILE_UPLOADED
			},
			chatSlug
		});

		await MessageModel.updateOne(
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
		@Ctx('user') user: User,
		@PubSub() pubSub: PubSubEngine
	): Promise<void> {
		let userList: User[] = null;

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
		@Ctx('user') user: User,
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
		return await UserModel.findById(chat.createdBy);
	}

	@FieldResolver()
	async messages(
		@Root() chat: Chat,
		@Info() info: any,
		@Arg('first', () => Int, { nullable: true }) first: number,
		@Arg('last', () => Int, { nullable: true }) last: number,
		@Arg('after', { nullable: true }) after: string,
		@Arg('before', { nullable: true }) before: string
	): Promise<MessageConnection> {
		const requestedFields = graphqlFields(info);
		const limit = first || last || 20;
		const cursor = before || after ? new ObjectID(before || after) : null;
		const messages = await MessageModel.aggregate([
			{
				$match: cursor
					? {
							_id: { [before ? '$gt' : '$lt']: cursor },
							chatSlug: chat.slug
					  }
					: { chatSlug: chat.slug }
			},
			{ $sort: { createdAt: -1 } },
			{ $limit: limit }
		]);

		const edges = messages.map(message => ({
			cursor: message._id,
			node: message
		}));

		const pageInfo = {
			async getHasPreviousPage() {
				if (messages.length < limit) return false;
				return !!(await MessageModel.findOne({
					_id: { [before ? '$lt' : '$gt']: cursor },
					chatSlug: chat.slug
				}));
			},
			async getHasNextPage() {
				if (messages.length < limit) return false;
				return !!(await MessageModel.findOne({
					_id: { [before ? '$lt' : '$gt']: messages[messages.length - 1]._id },
					chatSlug: chat.slug
				}));
			}
		};

		let returnValue: MessageConnection = {
			edges: edges.reverse(),
			pageInfo: {}
		};

		if (requestedFields.pageInfo) {
			const { hasNextPage, hasPreviousPage } = requestedFields.pageInfo;
			if (hasNextPage) {
				returnValue.pageInfo.hasNextPage = await pageInfo.getHasNextPage();
			}

			if (hasPreviousPage) {
				returnValue.pageInfo.hasPreviousPage = await pageInfo.getHasPreviousPage();
			}
		}

		return returnValue;
	}
}
