import client from './client';
import gql from 'graphql-tag';
import { IUser } from '../types/interfaces';
import { USER_ENTITY_FRAGMENT } from './fragments';

export const CLIENT_QUERY = gql`
	{
		client @client {
			isNavOpen
			currentUser {
					${USER_ENTITY_FRAGMENT}
			}	
		}
	}
`;

function getData() {
	return client.readQuery({ query: CLIENT_QUERY }).client;
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