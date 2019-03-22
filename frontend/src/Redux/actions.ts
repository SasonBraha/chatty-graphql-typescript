import { SET_AUTH_MODAL } from './constants';

export const setAuthModal = (bool: boolean) => ({
	type: SET_AUTH_MODAL,
	payload: bool
});
