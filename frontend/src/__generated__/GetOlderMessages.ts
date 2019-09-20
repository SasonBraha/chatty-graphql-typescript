/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOlderMessages
// ====================================================

export interface GetOlderMessages_olderMessages_createdBy {
	__typename: 'CreatedBy';
	displayName: string;
	avatar: string;
	slug: string;
}

export interface GetOlderMessages_olderMessages_file_dimensions {
	__typename: 'FileDimensions';
	height: number | null;
	width: number | null;
}

export interface GetOlderMessages_olderMessages_file {
	__typename: 'File';
	path: string;
	dimensions: GetOlderMessages_olderMessages_file_dimensions;
}

export interface GetOlderMessages_olderMessages_userMentions {
	__typename: 'Mention';
	displayName: string;
	indices: number[];
	slug: string;
}

export interface GetOlderMessages_olderMessages {
	__typename: 'Message';
	_id: string | null;
	text: string;
	createdBy: GetOlderMessages_olderMessages_createdBy;
	file: GetOlderMessages_olderMessages_file | null;
	isClientDeleted: boolean | null;
	creationToken: string | null;
	chatSlug: string;
	createdAt: any;
	userMentions: GetOlderMessages_olderMessages_userMentions[] | null;
}

export interface GetOlderMessages {
	olderMessages: GetOlderMessages_olderMessages[] | null;
}

export interface GetOlderMessagesVariables {
	chatSlug: string;
	beforeMessageId: string;
}
