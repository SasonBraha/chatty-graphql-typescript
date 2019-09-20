/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users_userList {
	__typename: 'User';
	displayName: string;
	slug: string;
	avatar: string;
}

export interface GetUsers_users {
	__typename: 'SearchUsersOutput';
	searchToken: string;
	userList: GetUsers_users_userList[];
}

export interface GetUsers {
	users: GetUsers_users;
}

export interface GetUsersVariables {
	limit?: number | null;
	displayName: string;
}
