import { ApolloTypenameEnum, CrudEnum } from '../types/enums';
import {
	_GetGenericModalDocument,
	_GetMentionSuggesterDocument,
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
		chat: (_, args, { cache }) => {
			let result = null;
			const query = {
				query: _GetTypingUsersDocument,
				variables: { ...args }
			};

			try {
				result = cache.readQuery(query);
			} catch (ex) {
				cache.writeQuery({
					...query,
					data: {
						chat: {
							typingUsers: [],
							__typename: ApolloTypenameEnum.CHAT
						}
					}
				});

				result = cache.readQuery(query);
			}

			return result;
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
			let prevData = cache.readQuery(query);

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
		},
		setMentionSuggester(_, { data }, { cache }) {
			cache.writeQuery({
				query: _GetMentionSuggesterDocument,
				data: {
					mentionSuggester: {
						...data,
						__typename: ApolloTypenameEnum._MENTION_SUGGESTER
					}
				}
			});
		}
	}
};
