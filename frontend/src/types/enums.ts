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
	INVALID_TOKEN = i18n.t('global.errors.expiredToken') as any
}

export enum LocalStorageEnum {
	ON_LOAD_MESSAGE = 'ON_LOAD_MESSAGE'
}
