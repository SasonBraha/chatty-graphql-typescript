export enum UserPermissionTypesEnum {
	DELETE_USER = 'DELETE_USER',
	EDIT_USER = 'EDIT_USER'
}

export enum ChatPermissionTypesEnum {
	CREATE_CHAT = 'CREATE_CHAT',
	VIEW_CHAT = 'VIEW_CHAT',
	POST_MESSAGE = 'POST_MESSAGE',
	DELETE_MESSAGE = 'DELETE_MESSAGE',
	DELETE_OWN_MESSAGE = 'DELETE_OWN_MESSAGE',
	EDIT_CHAT = 'EDIT_CHAT',
	DELETE_CHAT = 'DELETE_CHAT',
	EDIT_MESSAGE = 'EDIT_MESSAGE',
	EDIT_OWN_MESSAGE = 'EDIT_OWN_MESSAGE',
	REMOVE_MESSAGE = 'REMOVE_MESSAGE'
}

const userPermissions = [
	ChatPermissionTypesEnum.CREATE_CHAT,
	ChatPermissionTypesEnum.VIEW_CHAT,
	ChatPermissionTypesEnum.POST_MESSAGE,
	ChatPermissionTypesEnum.DELETE_OWN_MESSAGE,
	ChatPermissionTypesEnum.EDIT_OWN_MESSAGE
];

const moderatorPermissions = [
	...userPermissions,
	ChatPermissionTypesEnum.EDIT_CHAT,
	ChatPermissionTypesEnum.DELETE_CHAT,
	ChatPermissionTypesEnum.EDIT_MESSAGE,
	ChatPermissionTypesEnum.REMOVE_MESSAGE
];

const adminPermissions = [
	...moderatorPermissions,
	UserPermissionTypesEnum.DELETE_USER,
	UserPermissionTypesEnum.EDIT_USER,
	ChatPermissionTypesEnum.DELETE_MESSAGE
];

const rolePermissions = {
	User: userPermissions,
	Moderator: moderatorPermissions,
	Admin: adminPermissions
};

export default rolePermissions;
