import { ApolloTypenameEnum } from '../types/enums';
import {
	_GetGenericModalDocument,
	_GetNavStateDocument,
	_GetNotificationsDataDocument
} from '../__generated__/graphql';
import client from '../apollo/client';

export const setGenericModal = data => {
	client.writeData({ data: { genericModal: data } });
};

export default {
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
		}
	}
};
