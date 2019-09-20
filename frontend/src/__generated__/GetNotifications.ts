/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNotifications
// ====================================================

export interface GetNotifications_notifications_sender {
	__typename: 'User';
	displayName: string;
	slug: string;
}

export interface GetNotifications_notifications {
	__typename: 'Notification';
	_id: string;
	ref: string;
	sender: GetNotifications_notifications_sender;
	type: string;
}

export interface GetNotifications {
	notifications: GetNotifications_notifications[];
}
