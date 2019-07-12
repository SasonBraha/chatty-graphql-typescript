import client from './client';
import gql from 'graphql-tag';
import { INotification, ITypingUser, IUser } from '../types/interfaces';
import { USER_ENTITY_FRAGMENT } from './fragments';
import { CrudEnum } from '../types/enums';
import { removeChar } from '../utils';

export interface ILocalCache {
	showAuthModal: boolean;
	genericModal: {
		type: string | null;
		show: boolean;
		text: string | null;
	};
	isNavOpen: boolean;
	currentUser: IUser | null;
	notifications: {
		unreadCount: number;
		list: INotification[];
	};
	chat: {
		chatSlug: string;
		typingUsers: {
			[key: string]: ITypingUser[];
		};
		mentionSuggester: {
			shouldShow: boolean;
			userList: IUser[];
		};
	};
	appLists: { [key: string]: string };
}

export const CLIENT_QUERY = gql`
    {
        client @client {
            isNavOpen
            currentUser {
                ${USER_ENTITY_FRAGMENT}
            }
            chat {
                mentionSuggester {
                    shouldShow
                    userList {
                        displayName
                        avatar
                        slug
                    }
                }
            }
            notifications {
                unreadCount
                list
            }
            showAuthModal
            genericModal {
                show
                type
                text
            }
        }
    }
`;

function getData(options: { [key: string]: any } = {}): ILocalCache {
	const typingUsersFragment = options.chatSlug
		? `
			typingUsers {
				${removeChar(options.chatSlug, '[@-]')} {
					displayName
				}
			}
		`
		: '';
	const data = client.readQuery({
		query: CLIENT_QUERY
	}).client;

	return data;
}

function writeData(data: { [key: string]: any }) {
	client.writeData({
		data: {
			client: {
				...data
			}
		}
	});
}

export const setNavState = () => {
	const { isNavOpen } = getData();
	writeData({
		isNavOpen: !isNavOpen
	});
};

export const setCurrentUser = (currentUser: IUser) => {
	writeData({
		currentUser
	});
};

export const setChatSlug = (chatSlug: string) => {
	writeData({
		chat: {
			chatSlug
		}
	});
};

export const setTypingUsers = (
	user: { displayName: string; slug: string },
	crudType: string,
	chatSlug: string
) => {
	const { chat } = getData({
		chatSlug
	});
	const parsedSlug = removeChar(chatSlug, '[@-]');
	if (!chat.typingUsers[parsedSlug]) {
		chat.typingUsers[parsedSlug] = [];
	}

	console.log(chat);

	chat.typingUsers[parsedSlug] =
		crudType === CrudEnum.UPDATE
			? [...chat.typingUsers[parsedSlug], user]
			: chat.typingUsers[parsedSlug].filter(
					({ slug }: { slug: string }) => slug !== user.slug
			  );

	writeData({
		chat
	});
};

export const setMentionSuggester = (shouldShow: boolean, userList: IUser[]) => {
	writeData({
		chat: {
			mentionSuggester: {
				shouldShow,
				userList
			}
		}
	});
};

export const setNotificationsData = (data: {
	unreadCount?: number;
	list?: INotification[];
}) => {
	const { notifications } = getData();
	writeData({
		notifications: {
			...notifications,
			...data
		}
	});
};

export const setAuthModal = (bool: boolean) => {
	writeData({
		showAuthModal: bool
	});
};

export const resetModals = () => {
	writeData({
		showAuthModal: false,
		genericModal: {
			show: false
		}
	});
};

export const setGenericModal = (type: 'success' | 'error', text: string) => {
	writeData({
		genericModal: {
			type,
			show: true,
			text
		}
	});
};
