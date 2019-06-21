import {
	RESET_MODALS,
	SET_AUTH_MODAL,
	SET_GENERIC_MODAL,
	SET_NOTIFICATIONS_DATA
} from './constants';
import { INotification } from '../types/interfaces';

export const setAuthModal = (bool: boolean) => ({
	type: SET_AUTH_MODAL,
	payload: bool
});

export const setGenericModal = (type: 'success' | 'error', text: string) => ({
	type: SET_GENERIC_MODAL,
	payload: { type, text }
});

export const resetModals = () => ({ type: RESET_MODALS });

export const setNotificationsData = (data: {
	unread?: number;
	list?: INotification[];
}) => ({
	type: SET_NOTIFICATIONS_DATA,
	payload: data
});
