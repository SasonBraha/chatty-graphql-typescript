/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: SubscribeToActiveUsers
// ====================================================

export interface SubscribeToActiveUsers_onActiveUsersUpdate {
	__typename: 'User';
	displayName: string;
	avatar: string;
	slug: string;
}

export interface SubscribeToActiveUsers {
	onActiveUsersUpdate: SubscribeToActiveUsers_onActiveUsersUpdate[] | null;
}

export interface SubscribeToActiveUsersVariables {
	chatSlug: string;
}
