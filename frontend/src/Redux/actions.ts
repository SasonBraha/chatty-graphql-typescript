import { SET_AUTH_MODAL, RESET_MODALS } from './constants';

export const setAuthModal = (bool: boolean) => ({
	type: SET_AUTH_MODAL,
	payload: bool
});

export const resetModals = () => ({ type: RESET_MODALS });
