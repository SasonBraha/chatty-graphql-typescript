import {
	SET_AUTH_MODAL,
	RESET_MODALS,
	SET_NAV_STATE,
	SET_CURRENT_USER
} from './constants';
import { IUser } from '../models';

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

export const resetModals = () => ({ type: RESET_MODALS });
