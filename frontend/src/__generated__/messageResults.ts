/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: messageResults
// ====================================================

export interface messageResults_createdBy {
	__typename: 'CreatedBy';
	displayName: string;
	avatar: string;
	slug: string;
}

export interface messageResults_file_dimensions {
	__typename: 'FileDimensions';
	height: number | null;
	width: number | null;
}

export interface messageResults_file {
	__typename: 'File';
	path: string;
	dimensions: messageResults_file_dimensions;
}

export interface messageResults_userMentions {
	__typename: 'Mention';
	displayName: string;
	indices: number[];
	slug: string;
}

export interface messageResults {
	__typename: 'Message';
	_id: string | null;
	text: string;
	createdBy: messageResults_createdBy;
	file: messageResults_file | null;
	isClientDeleted: boolean | null;
	creationToken: string | null;
	chatSlug: string;
	createdAt: any;
	userMentions: messageResults_userMentions[] | null;
}
