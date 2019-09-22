import React, { useState } from 'react';
import gql from 'graphql-tag';
import MessagesList from './MessagesList';
import { IChatProps } from '../Chat';
import { IChat, IMessage } from '../../../types/interfaces';
import produce from 'immer';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';

const MESSAGE_ATTRIBUTES = gql`
	fragment messageResults on Message {
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
		creationToken
		chatSlug
		createdAt
		userMentions {
			displayName
			indices
			slug
		}
	}
`;

const MESSAGES_LIST_QUERY = gql`
	query GetMessages($chatSlug: String!) {
		chat(chatSlug: $chatSlug) {
			storeMessages
			messages(first: 20) {
				edges {
					cursor
					node {
						...messageResults
					}
				}
				pageInfo {
					hasNextPage
					hasPreviousPage
				}
			}
		}
	}
	${MESSAGE_ATTRIBUTES}
`;

const MESSAGES_LIST_UPDATES = gql`
	subscription SubscribeToMessageUpdates($chatSlug: String!) {
		onMessageUpdate(chatSlug: $chatSlug)
	}
`;

const GET_OLDER_MESSAGES = gql`
	query GetOlderMessages($chatSlug: String!, $beforeMessageId: ID!) {
		olderMessages(chatSlug: $chatSlug, beforeMessageId: $beforeMessageId) {
			...messageResults
		}
	}
	${MESSAGE_ATTRIBUTES}
`;

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	FILE_UPLOADED = 'FILE_UPLOADED',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	MESSAGE_EDITED = 'MESSAGE_EDITED'
}

interface IPrev {
	chat: IChat;
}

interface IProps extends IChatProps {}

const MessagesListData = (props: IProps) => {
	const [isFetching, setIsFetching] = useState(false);
	const [isMoreMessagesToFetch, setIsMoreMessagesToFetch] = useState(true);
	const { chatSlug } = props.match.params;
	const { data, fetchMore, subscribeToMore, loading, ...result } = useQuery(
		MESSAGES_LIST_QUERY,
		{
			variables: {
				chatSlug
			}
		}
	);
	if (result.error) {
		// setGenericModal('error', t('chat.roomNotFound'));
		return <Redirect to='/' />;
	}

	return (
		<MessagesList
			{...result}
			updateQuery={result.updateQuery as any}
			data={{
				chat: {
					messages: loading
						? []
						: data && data.chat
						? data.chat.messages.edges
						: [],
					storeMessages: loading
						? null
						: data && data.chat
						? data.chat.storeMessages
						: null
				}
			}}
			loading={loading}
			chatSlug={chatSlug}
			isFetching={isFetching}
			isMoreMessagesToFetch={isMoreMessagesToFetch}
			setIsMoreMessagesToFetch={setIsMoreMessagesToFetch}
			found={!loading && data && data.chat}
			fetchOlderMessages={(chatSlug: string, beforeMessageId: string) => {
				setIsFetching(true);
				fetchMore({
					query: GET_OLDER_MESSAGES,
					//@ts-ignore
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
							subscriptionData.data.onMessageUpdate
						);
						const updateType = updatedData.updateType;
						switch (updateType) {
							case SubscriptionTypesEnum.NEW_MESSAGE:
								return {
									chat: {
										...prev.chat,
										messages: {
											...prev.messages,
											edges: [...prev.chat.messages.edges, updatedData.message]
										},
										lastMessage: updatedData.message.text
									}
								};

							case SubscriptionTypesEnum.FILE_UPLOADED:
							case SubscriptionTypesEnum.MESSAGE_DELETED:
							case SubscriptionTypesEnum.MESSAGE_EDITED:
								const targetMessageIdx =
									prev.chat.messages.edges.length -
									1 -
									prev.chat.messages.edges
										.slice()
										.reverse()
										.findIndex(
											({ node }) => node._id === updatedData.messageId
										);
								switch (updateType) {
									case SubscriptionTypesEnum.FILE_UPLOADED:
										return produce(prev, draft => {
											draft.chat.messages.edges[targetMessageIdx].node.file =
												updatedData.file;
										});

									case SubscriptionTypesEnum.MESSAGE_DELETED:
										return produce(prev, draft => {
											draft.chat.messages.edges[
												targetMessageIdx
											].node.isClientDeleted = true;
										});

									case SubscriptionTypesEnum.MESSAGE_EDITED:
										return produce(prev, draft => {
											draft.chat.messages.edges[targetMessageIdx].node.text =
												updatedData.updatedText;
										});
								}
						}
					}
				})
			}
		/>
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
export default MessagesListData;
