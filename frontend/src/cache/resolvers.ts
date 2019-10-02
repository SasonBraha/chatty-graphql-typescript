import { ApolloTypenameEnum, CrudEnum } from '../types/enums';
import {
	_GetGenericModalDocument,
	_GetNavStateDocument,
	_GetNotificationsDataDocument,
	_GetTypingUsersDocument
} from '../__generated__/graphql';
import client from '../apollo/client';
import produce from 'immer';

export const setGenericModal = data => {
	client.writeData({ data: { genericModal: data } });
};

export default {
	Query: {
		chat: () => {
			console.log('here');
		}
	},
	Mutation: {
		updateCurrentUser(_, { user }, { cache }) {
			cache.writeData({
				data: {
					currentUser: {
						...user,
						__typename: ApolloTypenameEnum.USER
					}
				}
			});
		},
		setNotificationsData(_, { data: { unreadCount } }, { cache }) {
			const { notificationsData } = cache.readQuery({
				query: _GetNotificationsDataDocument
			});
			cache.writeData({
				data: {
					notificationsData: {
						...notificationsData,
						unreadCount
					}
				}
			});
		},
		toggleNavState(_, __, { cache }) {
			const { isNavOpen } = cache.readQuery({ query: _GetNavStateDocument });
			cache.writeData({
				data: {
					isNavOpen: !isNavOpen
				}
			});
		},
		setAuthModal(_, { isOpen }, { cache }) {
			cache.writeData({
				data: {
					isAuthModalOpen: isOpen
				}
			});
		},
		setGenericModal(_, { data }, { cache }) {
			const { genericModal } = cache.readQuery({
				query: _GetGenericModalDocument
			});
			setGenericModal({
				...genericModal,
				...data
			});
		},
		setCurrentChatSlug(_, { slug }, { cache }) {
			cache.writeData({
				data: {
					currentChatSlug: slug
				}
			});
		},
		setTypingUsers(_, { crudType, chatSlug, displayName }, { cache }) {
			const query = {
				query: _GetTypingUsersDocument,
				variables: { chatSlug }
			};
			const prevData = cache.readQuery(query);
			const { typingUsers } = prevData.chat;
			const updatedData = produce(prevData, draft => {
				draft.chat.typingUsers =
					crudType === CrudEnum.UPDATE
						? [...typingUsers, displayName]
						: typingUsers.filter(_displayName => _displayName !== displayName);
			});
			cache.writeQuery({
				...query,
				data: {
					...updatedData
				}
			});
		}
	},
	Chat: {
		typingUsers: (root, __, { cache }) => {
			console.log(root);
			return [];
		}
	}
};
