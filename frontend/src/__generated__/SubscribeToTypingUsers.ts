/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: SubscribeToTypingUsers
// ====================================================

export interface SubscribeToTypingUsers_onTypingUsersUpdate_user {
	__typename: 'User';
	displayName: string;
	slug: string;
}

export interface SubscribeToTypingUsers_onTypingUsersUpdate {
	__typename: 'UserTypingOutput';
	crudType: string;
	chatSlug: string;
	user: SubscribeToTypingUsers_onTypingUsersUpdate_user;
}

export interface SubscribeToTypingUsers {
	onTypingUsersUpdate: SubscribeToTypingUsers_onTypingUsersUpdate | null;
}
