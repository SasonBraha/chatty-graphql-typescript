import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import MessagesList from './MessagesList';
import { IChatProps } from '../Chat';
import produce from 'immer';
import { Redirect } from 'react-router';
import {
	useChatRoomUpdatesSubscription,
	use_GetCurrentUserQuery,
	useGetMessagesQuery,
	User,
	GetMessagesDocument
} from '../../../__generated__/graphql';
import { on } from 'cluster';

const MESSAGES_LIST_UPDATES = gql`
	subscription SubscribeToMessageUpdates($chatSlug: String!) {
		onMessageUpdate(chatSlug: $chatSlug) {
			... on FileUploadedOutput {
				file {
					dimensions {
						height
						width
					}
					path
				}
			}

			... on MessageDeletedOutput {
				messageId
				updateType
			}

			... on NewMessageOutput {
				message {
					cursor
					node {
						text
						creationToken
						file {
							path
						}
					}
				}
				updateType
			}
		}
	}
`;

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	FILE_UPLOADED = 'FILE_UPLOADED',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	MESSAGE_EDITED = 'MESSAGE_EDITED'
}

interface IProps extends IChatProps {}

const MessagesListData = (props: IProps) => {
	const [isFetching, setIsFetching] = useState(false);
	const [isMoreMessagesToFetch, setIsMoreMessagesToFetch] = useState(true);
	const { chatSlug } = props.match.params;
	const {
		data: { currentUser }
	} = use_GetCurrentUserQuery();
	const {} = useChatRoomUpdatesSubscription({
		variables: { chatSlug },
		onSubscriptionData({
			client,
			subscriptionData: {
				data: { onMessageUpdate }
			}
		}) {
			// @ts-ignore
			const { updateType, ...rest } = onMessageUpdate;
			switch (updateType) {
				case SubscriptionTypesEnum.NEW_MESSAGE:
					// @ts-ignore
					const newMessage = rest.message;
					const prevMessages = client.readQuery({
						query: GetMessagesDocument,
						variables: { chatSlug, first: 20 }
					});
					const updatedMessages = produce(prevMessages, draft => {
						draft.chat.messages.edges.push(newMessage);
					});
					client.writeData({
						data: {
							...updatedMessages
						}
					});
					break;
			}
			console.log(updateType, rest);
		}
	});
	const {
		data,
		fetchMore,
		subscribeToMore,
		loading,
		...result
	} = useGetMessagesQuery({
		variables: {
			chatSlug,
			first: 20
		}
	});

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
			found={!!(!loading && data && data.chat)}
			currentUser={currentUser as User}
			fetchOlderMessages={(chatSlug: string, beforeMessageId: string) => {
				setIsFetching(true);
				fetchMore({
					variables: { chatSlug, first: 20, before: beforeMessageId },
					updateQuery: (prev, { fetchMoreResult }) => {
						setIsFetching(false);
						if (!fetchMoreResult.chat.messages.pageInfo.hasPreviousPage) {
							setIsMoreMessagesToFetch(false);
							return prev;
						}
						return {
							chat: {
								...prev.chat,
								messages: [
									...fetchMoreResult.chat.messages.edges.reverse(),
									...prev.chat.messages.edges
								]
							}
						};
					}
				});
			}}
			subscribeToUpdates={
				(chatSlug: string) => () => null
				// subscribeToMore({
				// 	document: MESSAGES_LIST_UPDATES,
				// 	variables: { chatSlug },
				// 	updateQuery: (prev, { subscriptionData }) => {
				// 		console.log(subscriptionData);
				// 		return;
				//
				// 		const updatedData = JSON.parse(
				// 			//@ts-ignore
				// 			subscriptionData.data.onMessageUpdate
				// 		);
				// 		const updateType = updatedData.updateType;
				// 		switch (updateType) {
				// 			case SubscriptionTypesEnum.NEW_MESSAGE:
				// 				console.log(updatedData.message);
				// 				return {
				// 					chat: {
				// 						...prev.chat,
				// 						messages: {
				// 							// @ts-ignore
				// 							...prev.messages,
				// 							edges: [...prev.chat.messages.edges, updatedData.message]
				// 						},
				// 						lastMessage: updatedData.message.text
				// 					}
				// 				};
				//
				// 			case SubscriptionTypesEnum.FILE_UPLOADED:
				// 			case SubscriptionTypesEnum.MESSAGE_DELETED:
				// 			case SubscriptionTypesEnum.MESSAGE_EDITED:
				// 				const targetMessageIdx =
				// 					prev.chat.messages.edges.length -
				// 					1 -
				// 					prev.chat.messages.edges
				// 						.slice()
				// 						.reverse()
				// 						.findIndex(
				// 							({ node }) => node._id === updatedData.messageId
				// 						);
				// 				switch (updateType) {
				// 					case SubscriptionTypesEnum.FILE_UPLOADED:
				// 						return produce(prev, draft => {
				// 							draft.chat.messages.edges[targetMessageIdx].node.file =
				// 								updatedData.file;
				// 						});
				//
				// 					// case SubscriptionTypesEnum.MESSAGE_DELETED:
				// 					// 	return produce(prev, draft => {
				// 					// 		draft.chat.messages.edges[
				// 					// 			targetMessageIdx
				// 					// 		].node.isClientDeleted = true;
				// 					// 	});
				//
				// 					case SubscriptionTypesEnum.MESSAGE_EDITED:
				// 						return produce(prev, draft => {
				// 							draft.chat.messages.edges[targetMessageIdx].node.text =
				// 								updatedData.updatedText;
				// 						});
				// 				}
				// 		}
				// 	}
				// })
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
