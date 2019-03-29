import {
	SET_AUTH_MODAL,
	RESET_MODALS,
	SET_NAV_STATE,
	SET_CURRENT_USER
} from './constants';
import { IUser } from '../models/index';

interface IAction {
	type: string;
	payload?: any;
}

export interface IReducerState {
	showAuthModal: boolean;
	isNavOpen: boolean;
	currentUser: IUser | null;
}

const initalState: IReducerState = {
	showAuthModal: false,
	isNavOpen: true,
	currentUser: null
};

export default (state = initalState, action: IAction): IReducerState => {
	switch (action.type) {
		case RESET_MODALS:
			return {
				...state,
				showAuthModal: false
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

		default:
			return state;
	}
};
