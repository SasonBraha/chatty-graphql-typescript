import {
	RESET_MODALS,
	SET_AUTH_MODAL,
	SET_CURRENT_USER,
	SET_GENERIC_MODAL,
	SET_NAV_STATE
} from './constants';
import { IUser } from '../types/interfaces';

export const setAuthModal = (bool: boolean) => ({
	type: SET_AUTH_MODAL,
	payload: bool
});

export const setNavState = () => ({
	type: SET_NAV_STATE
});

export const setCurrentUser = (user: IUser) => ({
	type: SET_CURRENT_USER,
	payload: user
});

export const setGenericModal = (type: 'success' | 'error', text: string) => ({
	type: SET_GENERIC_MODAL,
	payload: { type, text }
});

export const resetModals = () => ({ type: RESET_MODALS });
