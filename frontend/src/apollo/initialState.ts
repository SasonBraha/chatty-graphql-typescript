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
		client: {
			genericModal: {
				type: null,
				show: false,
				text: null,
				__typename: ApolloTypenameEnum.client__GENERIC_MODAL
			},
			chat: {
				typingUsers: '',
				chatSlug: '',
				mentionSuggester: {
					shouldShow: false,
					userList: [],
					__typename: ApolloTypenameEnum.client__CHAT_MENTION_SUGGESTER
				},
				__typename: ApolloTypenameEnum.client__CHAT
			},
			__typename: ApolloTypenameEnum.client__CLIENT
		}
	}
};
