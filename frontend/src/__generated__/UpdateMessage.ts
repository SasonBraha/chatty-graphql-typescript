/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateMessage
// ====================================================

export interface UpdateMessage {
	updateMessage: boolean;
}

export interface UpdateMessageVariables {
	messageId: string;
	crudType: string;
	messageText?: string | null;
	creationToken?: string | null;
	chatSlug: string;
}
