import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import MessagesList from './MessagesList';
import { IChatProps } from '../Chat';
import { IChat, IFile, IMessage } from '../../../models';
import ApolloClient from 'apollo-client';
import produce from 'immer';

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
	isClientDeleted
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

const MESSAGES_LIST_UPDATES = gql`
	subscription($chatSlug: String!) {
		messagesUpdates(chatSlug: $chatSlug)
	}
`;

const GET_OLDER_MESSAGES = gql`
	query($chatSlug: String!, $beforeMessageId: ID!) {
		olderMessages(chatSlug: $chatSlug, beforeMessageId: $beforeMessageId) {
			${MESSAGE_DATA_FRAGMENT}
		}
	}
`;

interface IPrev {
	chat: IChat;
}

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	FILE_UPLOADED = 'FILE_UPLOADED',
	MESSAGE_DELETED = 'MESSAGE_DELETED'
}

interface IProps extends IChatProps {
	client: ApolloClient<any>;
}

const MessagesListData = (props: IProps) => {
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
					updateQuery={result.updateQuery as any}
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
										...prev.chat,
										messages: [
											...fetchMoreResult.olderMessages.reverse(),
											...prev.chat.messages
										]
									}
								};
							}
						});
					}}
					subscribeToUpdates={(chatSlug: string) =>
						subscribeToMore({
							document: MESSAGES_LIST_UPDATES,
							variables: { chatSlug },
							updateQuery: (prev, { subscriptionData }) => {
								const updatedData = JSON.parse(
									subscriptionData.data.messagesUpdates
								);
								const updateType = updatedData.updateType;
								switch (updateType) {
									case SubscriptionTypesEnum.NEW_MESSAGE:
										return {
											chat: {
												...prev.chat,
												messages: [...prev.chat.messages, updatedData.message]
											}
										};

									case SubscriptionTypesEnum.FILE_UPLOADED:
									case SubscriptionTypesEnum.MESSAGE_DELETED:
										const targetMessageIdx =
											prev.chat.messages.length -
											1 -
											prev.chat.messages
												.slice()
												.reverse()
												.findIndex(
													(message: IMessage) =>
														message._id === updatedData.messageId
												);

										if (updateType === SubscriptionTypesEnum.FILE_UPLOADED) {
											return produce(prev, (draft: IPrev) => {
												draft.chat.messages[targetMessageIdx].file =
													updatedData.file;
											});
										} else if (
											updateType === SubscriptionTypesEnum.MESSAGE_DELETED
										) {
											return produce(prev, (draft: IPrev) => {
												draft.chat.messages[
													targetMessageIdx
												].isClientDeleted = true;
											});
										}
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

// @ts-ignore
export default withApollo(MessagesListData);
