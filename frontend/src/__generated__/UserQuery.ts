/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_user {
	__typename: 'User';
	displayName: string;
	avatar: string;
	email: string;
	createdAt: any;
}

export interface UserQuery {
	user: UserQuery_user | null;
}

export interface UserQueryVariables {
	slug: string;
}
