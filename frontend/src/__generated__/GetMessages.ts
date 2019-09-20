/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMessages
// ====================================================

export interface GetMessages_chat_messages_edges_node_createdBy {
	__typename: 'CreatedBy';
	displayName: string;
	avatar: string;
	slug: string;
}

export interface GetMessages_chat_messages_edges_node_file_dimensions {
	__typename: 'FileDimensions';
	height: number | null;
	width: number | null;
}

export interface GetMessages_chat_messages_edges_node_file {
	__typename: 'File';
	path: string;
	dimensions: GetMessages_chat_messages_edges_node_file_dimensions;
}

export interface GetMessages_chat_messages_edges_node_userMentions {
	__typename: 'Mention';
	displayName: string;
	indices: number[];
	slug: string;
}

export interface GetMessages_chat_messages_edges_node {
	__typename: 'Message';
	_id: string | null;
	text: string;
	createdBy: GetMessages_chat_messages_edges_node_createdBy;
	file: GetMessages_chat_messages_edges_node_file | null;
	isClientDeleted: boolean | null;
	creationToken: string | null;
	chatSlug: string;
	createdAt: any;
	userMentions: GetMessages_chat_messages_edges_node_userMentions[] | null;
}

export interface GetMessages_chat_messages_edges {
	__typename: 'MessageEdge';
	cursor: string;
	node: GetMessages_chat_messages_edges_node;
}

export interface GetMessages_chat_messages_pageInfo {
	__typename: 'PageInfo';
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface GetMessages_chat_messages {
	__typename: 'MessageConnection';
	edges: GetMessages_chat_messages_edges[];
	pageInfo: GetMessages_chat_messages_pageInfo;
}

export interface GetMessages_chat {
	__typename: 'Chat';
	storeMessages: boolean;
	messages: GetMessages_chat_messages;
}

export interface GetMessages {
	chat: GetMessages_chat;
}

export interface GetMessagesVariables {
	chatSlug: string;
}
