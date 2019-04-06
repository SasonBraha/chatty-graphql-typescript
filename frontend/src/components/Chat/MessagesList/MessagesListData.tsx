import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MessagesList from './MessagesList';
const MESSAGES_LIST_QUERY = gql`
	query($chatSlug: String!) {
		chat(chatSlug: $chatSlug) {
			messages {
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
			}
		}
	}
`;

const NEW_MESSAGE_SUBSCRIPTION = gql`
	subscription($chatSlug: String!) {
		newMessage(chatSlug: $chatSlug) {
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
		}
	}
`;

interface IMatchParams {
	chatSlug?: string;
}

const MessagesListData = (props: RouteComponentProps<IMatchParams>) => {
	const { chatSlug } = props.match.params;
	return (
		<Query query={MESSAGES_LIST_QUERY} variables={{ chatSlug }}>
			{({ subscribeToMore, ...result }) => (
				<MessagesList
					{...result}
					subscribeToNewMessages={() =>
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

export default MessagesListData;
