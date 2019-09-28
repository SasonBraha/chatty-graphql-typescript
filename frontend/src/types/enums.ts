import i18n from '../locale';

export enum CrudEnum {
	DELETE = 'DELETE',
	UPDATE = 'UPDATE'
}

export enum KeyCodeEnum {
	ARROW_UP = 'ArrowUp',
	ARROW_DOWN = 'ArrowDown',
	ENTER = 'Enter',
	SPACE = ' ',
	BACKSPACE = 'Backspace',
	ESCAPE = 'Escape'
}

export enum UserUpdatesEnum {
	NEW_NOTIFICATION = 'NEW_NOTIFICATION'
}

export enum ErrorTypesEnum {
	INVALID_TOKEN = i18n.t('global.errors.expiredToken') as any,
	SOMETHING_WENT_WRONG = i18n.t('global.errors.somethingWentWrong') as any
}

export enum LocalStorageEnum {
	ON_LOAD_MESSAGE = 'ON_LOAD_MESSAGE'
}

export enum ApolloTypenameEnum {
	client__CLIENT = 'data.client',
	client__GENERIC_MODAL = 'data.client.genericModal',
	client__NOTIFICATIONS = 'data.client.notifications',
	client__CHAT_MENTION_SUGGESTER = 'data.client.chat.mentionSuggester',
	client__CHAT = 'data.client.chat',
	USER = 'User',
	NOTIFICATIONS_DATA = 'NotificationsData'
}
