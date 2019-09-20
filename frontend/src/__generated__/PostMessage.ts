/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PostMessage
// ====================================================

export interface PostMessage_postMessage {
	__typename: 'Message';
	_id: string | null;
}

export interface PostMessage {
	postMessage: PostMessage_postMessage | null;
}

export interface PostMessageVariables {
	chatSlug: string;
	text: string;
}
