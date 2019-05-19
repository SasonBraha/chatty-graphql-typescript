import {
	RESET_MODALS,
	SET_AUTH_MODAL,
	SET_CHAT_SLUG,
	SET_CURRENT_USER,
	SET_GENERIC_MODAL,
	SET_MENTION_SUGGESTER,
	SET_NAV_STATE,
	SET_TYPING_USERS
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

export const setChatSlug = (value: string) => ({
	type: SET_CHAT_SLUG,
	payload: value
});

export const setTypingUsers = (
	user: { displayName: string; slug: string },
	crudType: string,
	chatSlug: string
) => ({
	type: SET_TYPING_USERS,
	payload: {
		user,
		crudType,
		chatSlug
	}
});

export const resetModals = () => ({ type: RESET_MODALS });

export const setMentionSuggester = (
	shouldShow: boolean,
	userList: IUser[]
) => ({
	type: SET_MENTION_SUGGESTER,
	payload: {
		shouldShow,
		userList
	}
});
