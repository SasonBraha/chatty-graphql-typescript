import {
	RESET_MODALS,
	SET_AUTH_MODAL,
	SET_CHAT_SLUG,
	SET_CURRENT_USER,
	SET_GENERIC_MODAL,
	SET_NAV_STATE,
	SET_TYPING_USERS
} from './constants';
import { IUser } from '../types/interfaces';
import { CrudEnum } from '../types/enums';

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
	chat: {
		chatSlug: string;
		typingUsers: Array<{
			displayName: string;
			slug: string;
		}>;
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
	chat: {
		typingUsers: [],
		chatSlug: ''
	}
};

export default (state = initialState, action: IAction): IReducerState => {
	switch (action.type) {
		case RESET_MODALS:
			return {
				...state,
				showAuthModal: false,
				genericModal: {
					show: false,
					text: state.genericModal.text,
					type: state.genericModal.type
				}
			};

		case SET_AUTH_MODAL:
			return {
				...state,
				showAuthModal: action.payload
			};

		case SET_NAV_STATE:
			return {
				...state,
				isNavOpen: !state.isNavOpen
			};

		case SET_CURRENT_USER:
			return {
				...state,
				currentUser: action.payload
			};

		case SET_GENERIC_MODAL:
			return {
				...state,
				genericModal: {
					type: action.payload.type,
					show: true,
					text: action.payload.text
				}
			};

		case SET_CHAT_SLUG:
			return {
				...state,
				chat: {
					...state.chat,
					chatSlug: action.payload
				}
			};

		case SET_TYPING_USERS:
			return {
				...state,
				chat: {
					...state.chat,
					typingUsers:
						action.payload.crudType === CrudEnum.UPDATE
							? [...state.chat.typingUsers, action.payload.user]
							: state.chat.typingUsers.filter(
									({ slug }) => slug !== action.payload.user.slug
							  )
				}
			};

		default:
			return state;
	}
};
