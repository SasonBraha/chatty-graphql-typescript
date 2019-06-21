import client from './client';
import gql from 'graphql-tag';
import { IUser } from '../types/interfaces';
import { USER_ENTITY_FRAGMENT } from './fragments';
import { CrudEnum } from '../types/enums';

export const CLIENT_QUERY = gql`
	{
		client @client {
			isNavOpen
			currentUser {
					${USER_ENTITY_FRAGMENT}
			}
			chat {
					typingUsers
          mentionSuggester {
							shouldShow
							userList {
									displayName
									avatar
									slug
							}
  				}
			}	
		}
	}
`;

function getData() {
	const data = client.readQuery({ query: CLIENT_QUERY }).client;

	const parsedData = {
		...data,
		chat: {
			...data.chat,
			typingUsers: data.chat.typingUsers.length
				? JSON.parse(data.chat.typingUsers)
				: {}
		}
	};

	return parsedData;
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
	const { chat } = getData();

	if (!chat.typingUsers[chatSlug]) {
		chat.typingUsers[chatSlug] = [];
	}

	chat.typingUsers[chatSlug] =
		crudType === CrudEnum.UPDATE
			? [...chat.typingUsers[chatSlug], user]
			: chat.typingUsers[chatSlug].filter(
					({ slug }: { slug: string }) => slug !== user.slug
			  );

	writeData({
		chat: {
			typingUsers: JSON.stringify(chat.typingUsers)
		}
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
