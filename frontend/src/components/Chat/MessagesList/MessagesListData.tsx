import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MessagesList from './MessagesList';
import { IChatProps } from '../Chat';

const MESSAGE_DATA_FRAGMENT = `
	_id
	text
	createdBy {
		displayName
		avatar
		slug
	}
	file {
		path
		dimensions {
			height
			width
		}
	}
	createdAt
`;

const MESSAGES_LIST_QUERY = gql`
	query($chatSlug: String!) {
		chat(chatSlug: $chatSlug, isJoining: true) {
			messages {
				${MESSAGE_DATA_FRAGMENT}
			}
		}
	}
`;

const NEW_MESSAGE_SUBSCRIPTION = gql`
	subscription($chatSlug: String!) {
		newMessage(chatSlug: $chatSlug) {
			${MESSAGE_DATA_FRAGMENT}
		}
	}
`;

const GET_OLDER_MESSAGES = gql`
	query($chatSlug: String!, $beforeMessageId: String!) {
		olderMessages(chatSlug: $chatSlug, beforeMessageId: $beforeMessageId) {
			${MESSAGE_DATA_FRAGMENT}
		}
	}
`;

const MessagesListData = (props: IChatProps) => {
	const [isFetching, setIsFetching] = useState(false);
	const [isMoreMessagesToFetch, setIsMoreMessagesToFetch] = useState(true);
	const { chatSlug } = props.match.params;

	return (
		<Query query={MESSAGES_LIST_QUERY} variables={{ chatSlug }}>
			{({ subscribeToMore, fetchMore, data, loading, ...result }) => (
				<MessagesList
					{...result}
					data={{
						chat: {
							messages: loading ? [] : data.chat.messages
						}
					}}
					loading={loading}
					chatSlug={chatSlug}
					isFetching={isFetching}
					isMoreMessagesToFetch={isMoreMessagesToFetch}
					setIsMoreMessagesToFetch={setIsMoreMessagesToFetch}
					fetchOlderMessages={(chatSlug: string, beforeMessageId: string) => {
						setIsFetching(true);
						fetchMore({
							query: GET_OLDER_MESSAGES,
							variables: { chatSlug, beforeMessageId },
							updateQuery: (prev, { fetchMoreResult }) => {
								setIsFetching(false);
								if (!fetchMoreResult.olderMessages.length) {
									setIsMoreMessagesToFetch(false);
									return prev;
								}
								return {
									chat: {
										__typename: prev.chat.__typename,
										messages: [
											...fetchMoreResult.olderMessages,
											...prev.chat.messages
										]
									}
								};
							}
						});
					}}
					subscribeToNewMessages={(chatSlug: string) =>
						subscribeToMore({
							document: NEW_MESSAGE_SUBSCRIPTION,
							variables: { chatSlug },
							updateQuery: (prev, { subscriptionData }) => {
								if (!subscriptionData.data) return prev;
								const newMessage = subscriptionData.data.newMessage;
								return {
									chat: {
										__typename: prev.chat.__typename,
										messages: [...prev.chat.messages, newMessage]
									}
								};
							}
						})
					}
				/>
			)}
		</Query>
	);
};

MessagesListData.defaultProps = {
	data: {
		chat: {
			messages: []
		}
	}
};

export default MessagesListData;
