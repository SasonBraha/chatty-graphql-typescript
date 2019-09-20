/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRooms
// ====================================================

export interface GetRooms_roomsList_image {
	__typename: 'File';
	path: string;
}

export interface GetRooms_roomsList {
	__typename: 'Chat';
	_id: string;
	name: string;
	image: GetRooms_roomsList_image;
	slug: string;
	lastMessage: string | null;
}

export interface GetRooms {
	roomsList: GetRooms_roomsList[];
}
