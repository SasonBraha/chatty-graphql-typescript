import { ApolloTypenameEnum } from '../types/enums';

export default {
	data: {
		currentUser: null,
		notificationsData: {
			unreadCount: 0,
			__typename: ApolloTypenameEnum.NOTIFICATIONS_DATA
		},
		client: {
			showAuthModal: false,
			genericModal: {
				type: null,
				show: false,
				text: null,
				__typename: ApolloTypenameEnum.client__GENERIC_MODAL
			},
			isNavOpen: window.innerWidth > 992,
			currentUser: null,
			notifications: {
				unreadCount: 0,
				list: [],
				__typename: ApolloTypenameEnum.client__NOTIFICATIONS
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
