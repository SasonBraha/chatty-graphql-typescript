import {
	RESET_MODALS,
	SET_AUTH_MODAL,
	SET_CHAT_SLUG,
	SET_GENERIC_MODAL,
	SET_MENTION_SUGGESTER,
	SET_NOTIFICATIONS_DATA,
	SET_TYPING_USERS
} from './constants';
import { INotification, ITypingUser, IUser } from '../types/interfaces';
import { CrudEnum } from '../types/enums';
import produce from 'immer';

interface IAction {
	type: string;
	payload?: any;
}

export interface IReducerState {
	showAuthModal: boolean;
	genericModal: {
		type: string | null;
		show: boolean;
		text: string | null;
	};
	isNavOpen: boolean;
	currentUser: IUser | null;
	notifications: {
		unread: number;
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
}

const initialState: IReducerState = {
	showAuthModal: false,
	genericModal: {
		type: null,
		show: false,
		text: null
	},
	isNavOpen: window.innerWidth > 992,
	currentUser: null,
	notifications: {
		unread: 0,
		list: []
	},
	chat: {
		typingUsers: {},
		chatSlug: '',
		mentionSuggester: {
			shouldShow: false,
			userList: []
		}
	}
};

export default (state = initialState, action: IAction): IReducerState =>
	produce(state, (draft: IReducerState) => {
		switch (action.type) {
			case RESET_MODALS:
				draft.genericModal = {
					show: false,
					text: state.genericModal.text,
					type: state.genericModal.type
				};
				break;

			case SET_AUTH_MODAL:
				draft.showAuthModal = action.payload;
				break;

			case SET_GENERIC_MODAL:
				draft.genericModal = {
					type: action.payload.type,
					show: true,
					text: action.payload.text
				};
				break;

			case SET_CHAT_SLUG:
				draft.chat.chatSlug = action.payload;
				break;

			case SET_TYPING_USERS:
				const chatSlug = action.payload.chatSlug;

				if (!draft.chat.typingUsers[chatSlug]) {
					draft.chat.typingUsers[chatSlug] = [];
				}

				draft.chat.typingUsers[chatSlug] =
					action.payload.crudType === CrudEnum.UPDATE
						? [...draft.chat.typingUsers[chatSlug], action.payload.user]
						: draft.chat.typingUsers[chatSlug].filter(
								({ slug }) => slug !== action.payload.user.slug
						  );
				break;

			case SET_MENTION_SUGGESTER:
				draft.chat.mentionSuggester = action.payload;
				break;

			case SET_NOTIFICATIONS_DATA:
				draft.notifications = {
					...draft.notifications,
					...action.payload
				};
				break;

			default:
				return state;
		}
	});
