import { PubSubEngine } from 'type-graphql';
import { Chat, ChatController } from '../entities/Chat';
import { User } from '../entities/User';
import { Message, MessageModel } from '../entities/Message';
import { Mention } from '../entities/Mention';
import { Ref } from '@hasezoey/typegoose';
import shortid = require('shortid');
import { ErrorTypesEnum } from '../utils/errors';
import { generateUserMentionedNotification } from '../utils/notifications';
import { CrudEnum, SubscriptionTypesEnum, UserUpdatesEnum } from '../types/enums';
import { ChatPermissionTypesEnum } from '../permissions';
import sanitizer from './Sanitizer';
import { JWT } from './index';
import activeUsersService from '../redis/services/ActiveUsers.service';
import ChatRepository from '../repositories/ChatRepository';
import MessageRepository from '../repositories/MessageRepository';
import NotificationRepository from '../repositories/NotificationRepository';
import UserRepository from '../repositories/UserRepository';
import { CreateChatInput, UpdateMessageInput } from '../resolvers/Chat/chat.resolver.inputs';
import { uploadFile } from '../utils/files';

const getChatForUser = async (
	chatSlug: string,
	user: User
): Promise<Chat> => {
	const chat = await ChatRepository.findBySlugForUser(chatSlug, user._id.toString());
	if (!chat) {
		throw new Error(ErrorTypesEnum.NOT_FOUND);
	}
	return chat;
};

const listRoomsForUser = async (user: User): Promise<Chat[]> => {
	return ChatRepository.listForUser(user._id.toString());
};

const createChatRoom = async (
	{ name, isPrivate, storeMessages }: CreateChatInput,
	user: User
): Promise<Chat> => {
	return ChatController.createRoom({
		name,
		image: {
			path: '/images/default_chat.svg',
			isStoredRemotely: false,
			mimeType: 'svg',
			dimensions: {}
		},
		isPrivate,
		storeMessages,
		createdBy: (user._id as unknown) as Ref<User>,
		slug: `${name}@${shortid.generate()}`
	});
};

const buildUserMentions = async (
	text: string
): Promise<{ userMentions: Mention[]; usersData: User[] }> => {
	const mentionUserRegex = new RegExp('(@[\\wא-ת-_]+)', 'g');
	const mentions = text.match(mentionUserRegex);
	let userMentions: Mention[] = [];
	let usersData: User[] = [];

	if (mentions) {
		const usernames = mentions.map(mention => mention.slice(1));
		usersData = await UserRepository.findByDisplayNames(usernames);

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

	return { userMentions, usersData };
};

const publishNewMessage = async (
	messageData,
	user: User,
	pubSub: PubSubEngine
): Promise<void> => {
	await pubSub.publish(SubscriptionTypesEnum.NEW_MESSAGE, {
		payload: {
			message: {
				cursor: messageData._id,
				node: {
					...messageData,
					createdAt: new Date().toISOString(),
					creationToken: await JWT.generateToken(
						{ userId: user._id.toString(), messageId: messageData._id },
						false,
						'20h'
					),
					file: null
				}
			},
			updateType: SubscriptionTypesEnum.NEW_MESSAGE
		},
		chatSlug: messageData.chatSlug
	});
};

const notifyMentionedUsers = async (
	usersData: User[],
	senderId: string,
	chatSlug: string,
	messageId: string,
	pubSub: PubSubEngine
): Promise<void> => {
	await Promise.all(
		usersData.map(async ({ _id }) => {
			if (senderId !== _id.toString()) {
				const notification = await NotificationRepository.create(
					generateUserMentionedNotification(
						senderId,
						(_id as unknown) as string,
						`${chatSlug}/${messageId}`
					)
				);

				pubSub.publish(SubscriptionTypesEnum.USER_MENTIONED, {
					notification,
					userId: _id,
					type: UserUpdatesEnum.NEW_NOTIFICATION
				});
			}
		})
	);
};

const postMessage = async (
	text: string,
	chatSlug: string,
	user: User,
	pubSub: PubSubEngine
): Promise<Message | { _id: string }> => {
	const { userMentions, usersData } = await buildUserMentions(text);
	const preSaveMessage = new MessageModel();
	const { _id, displayName, slug, avatar } = user;
	const messageData = {
		_id: preSaveMessage._id,
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

	await publishNewMessage(messageData, user, pubSub);

	const targetChatRoom = await ChatRepository.findStorableRoomForUser(
		chatSlug,
		user._id.toString()
	);

	let newMessage: Message = null;
	if (targetChatRoom && targetChatRoom.storeMessages) {
		newMessage = await MessageRepository.create(messageData as Message);
		await ChatRepository.updateLastMessage(
			targetChatRoom._id.toString(),
			newMessage.text
		);

		await notifyMentionedUsers(
			usersData,
			user._id.toString(),
			chatSlug,
			newMessage._id.toString(),
			pubSub
		);
	}

	return newMessage
		? newMessage
		: { _id: (preSaveMessage._id as unknown) as string };
};

const updateMessage = async (
	updatePayload: UpdateMessageInput,
	user: User,
	pubSub: PubSubEngine
): Promise<boolean> => {
	const { messageId, creationToken, crudType, chatSlug } = updatePayload;
	const targetMessage = await MessageRepository.findById(messageId);
	let isUserCreatedTargetMessage = false;
	let shouldUpdateDB = false;

	if (!targetMessage && creationToken) {
		const creationTokenData: {
			userId;
			messageId;
		} = await JWT.validateTokenAndGetPayload(creationToken, false);

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
					chatSlug
				});

				if (shouldUpdateDB && targetMessage) {
					await MessageRepository.remove(targetMessage);
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
					chatSlug
				});

				if (shouldUpdateDB && targetMessage) {
					await MessageRepository.updateText(targetMessage, sanitizedText);
				}
			}
			return true;
	}
};

const uploadMessageFile = async (
	file,
	chatSlug: string,
	messageId: string,
	user: User,
	pubSub: PubSubEngine,
	uploadFileParam = uploadFile
): Promise<boolean> => {
	const fileData = await uploadFileParam(file, chatSlug);

	pubSub.publish(SubscriptionTypesEnum.FILE_UPLOADED, {
		payload: {
			messageId,
			file: fileData,
			updateType: SubscriptionTypesEnum.FILE_UPLOADED
		},
		chatSlug
	});

	await MessageRepository.updateFile(messageId, user._id.toString(), fileData);

	return true;
};

const updateActiveUsers = async (
	chatSlug: string,
	crudType: string,
	user: User,
	pubSub: PubSubEngine
): Promise<void> => {
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
};

const updateTypingUsers = (
	chatSlug: string,
	crudType: string,
	user: User,
	pubSub: PubSubEngine
): boolean => {
	pubSub.publish(SubscriptionTypesEnum.UPDATE_TYPING_USERS, {
		chatSlug,
		crudType,
		user: {
			displayName: user.displayName,
			slug: user.slug
		}
	});
	return true;
};

export default {
	getChatForUser,
	listRoomsForUser,
	createChatRoom,
	postMessage,
	updateMessage,
	uploadMessageFile,
	updateActiveUsers,
	updateTypingUsers
};
