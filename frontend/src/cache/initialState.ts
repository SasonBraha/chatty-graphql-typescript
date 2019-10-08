import { ApolloTypenameEnum } from '../types/enums';

export default {
	data: {
		currentUser: null,
		notificationsData: {
			unreadCount: 0,
			__typename: ApolloTypenameEnum._NOTIFICATIONS_DATA
		},
		isNavOpen: window.innerWidth > 992,
		isAuthModalOpen: false,
		genericModal: {
			type: null,
			show: false,
			text: null,
			__typename: ApolloTypenameEnum._GENERIC_MODAL
		},
		currentChatSlug: null,
		mentionSuggester: {
			show: false,
			userList: [],
			__typename: ApolloTypenameEnum._MENTION_SUGGESTER
		}
	}
};
