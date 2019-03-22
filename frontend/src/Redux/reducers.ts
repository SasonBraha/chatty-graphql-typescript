import { SET_AUTH_MODAL, RESET_MODALS } from './constants';

interface IAction {
	type: string;
	payload?: any;
}

interface IState {
	showAuthModal: boolean;
}

const initalState: IState = {
	showAuthModal: false
};

export default (state = initalState, action: IAction): IState => {
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

		default:
			return state;
	}
};
