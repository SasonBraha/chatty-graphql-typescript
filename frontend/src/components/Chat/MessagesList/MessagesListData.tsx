import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MessagesList from './MessagesList';
import { IChatProps } from '../Chat';
import { IFile, IMessage } from '../../../models';

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
		chat(chatSlug: $chatSlug) {
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

const FILE_UPLOADED_SUBSCRIPTION = gql`
	subscription($chatSlug: String!) {
		fileUploaded(chatSlug: $chatSlug)
	}
`;

const GET_OLDER_MESSAGES = gql`
	query($chatSlug: String!, $beforeMessageId: ID!) {
		olderMessages(chatSlug: $chatSlug, beforeMessageId: $beforeMessageId) {
			${MESSAGE_DATA_FRAGMENT}
		}
	}
`;

interface IFileUploadedResponse {
	messageId: string;
	chatSlug: string;
	file: IFile;
}

const MessagesListData = (props: IChatProps) => {
	const [isFetching, setIsFetching] = useState(false);
	const [isMoreMessagesToFetch, setIsMoreMessagesToFetch] = useState(true);
	const [
		shouldComponentUpdateIndicator,
		setShouldComponentUpdateIndicator
	] = useState(Math.random() * Date.now());
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
					shouldComponentUpdateIndicator={shouldComponentUpdateIndicator}
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
											...fetchMoreResult.olderMessages.reverse(),
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
										...prev.chat,
										messages: [...prev.chat.messages, newMessage]
									}
								};
							}
						})
					}
					subscribeToFileUpload={(chatSlug: string) =>
						subscribeToMore({
							document: FILE_UPLOADED_SUBSCRIPTION,
							variables: { chatSlug },
							updateQuery: (prev, { subscriptionData }) => {
								try {
									const fileData: IFileUploadedResponse = JSON.parse(
										subscriptionData.data.fileUploaded
									);
									const messageIdx =
										prev.chat.messages.length -
										1 -
										prev.chat.messages
											.slice()
											.reverse()
											.findIndex(
												(message: IMessage) => message._id === fileData.messageId
											);

									const updatedMessages = prev.chat.messages.slice();
									updatedMessages[messageIdx].file = fileData.file;

									return {
										chat: {
											...prev.chat,
											messages: [...updatedMessages]
										}
									};
								} finally {
									setShouldComponentUpdateIndicator(Math.random() * Date.now());
								}
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
