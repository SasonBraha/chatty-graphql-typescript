export default {
	data: {
		client: {
			showAuthModal: false,
			genericModal: {
				type: null,
				show: false,
				text: null
			},
			isNavOpen: window.innerWidth > 992,
			currentUser: null,
			notifications: {
				unreadCount: 0,
				list: []
			},
			chat: {
				typingUsers: '',
				chatSlug: '',
				mentionSuggester: {
					shouldShow: false,
					userList: []
				}
			}
		}
	}
};
