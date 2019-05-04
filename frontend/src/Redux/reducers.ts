import {
	SET_AUTH_MODAL,
	RESET_MODALS,
	SET_NAV_STATE,
	SET_CURRENT_USER,
	SET_GENERIC_MODAL,
	SET_MESSAGE_CONTEXT_MENU
} from './constants';
import { IUser, IMessage } from '../types/interfaces';

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
}

const initialState: IReducerState = {
	showAuthModal: false,
	genericModal: {
		type: null,
		show: false,
		text: null
	},
	isNavOpen: window.innerWidth > 992,
	currentUser: null
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

		default:
			return state;
	}
};
