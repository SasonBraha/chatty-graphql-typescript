import React, { useState } from 'react';
import MessagesList from './MessagesList';
import produce from 'immer';
import {
	FileUploadedOutput,
	GetMessagesDocument,
	MessageDeletedOutput,
	MessageEdge,
	MessageEditedOutput,
	NewMessageOutput,
	use_GetCurrentUserQuery,
	useChatRoomUpdatesSubscription,
	useGetMessagesQuery,
	User
} from '../../../__generated__/graphql';
import { IChatActiveAreaProps } from '../ActiveArea';

enum SubscriptionTypesEnum {
	NEW_MESSAGE = 'NEW_MESSAGE',
	FILE_UPLOADED = 'FILE_UPLOADED',
	MESSAGE_DELETED = 'MESSAGE_DELETED',
	MESSAGE_EDITED = 'MESSAGE_EDITED'
}

interface IProps extends IChatActiveAreaProps {}

const MessagesListData: React.FC<IProps> = props => {
	const [isFetching, setIsFetching] = useState(false);
	const [isMoreMessagesToFetch, setIsMoreMessagesToFetch] = useState(true);
	const [deletedMessages, setDeletedMessages] = useState<{
		[key: string]: boolean;
	}>({});
	const { chatSlug } = props.match.params;
	const {
		data: { currentUser }
	} = use_GetCurrentUserQuery();
	const { data, fetchMore, loading, ...result } = useGetMessagesQuery({
		fetchPolicy: 'network-only',
		variables: {
			chatSlug,
			first: 20
		}
	});
	const _ = useChatRoomUpdatesSubscription({
		variables: { chatSlug },
		onSubscriptionData({
			client,
			subscriptionData: {
				data: { onMessageUpdate }
			}
		}) {
			const { updateType } = onMessageUpdate;
			const query = {
				query: GetMessagesDocument,
				variables: { first: 20, chatSlug }
			};
			const prevData = client.readQuery(query);
			switch (updateType) {
				case SubscriptionTypesEnum.NEW_MESSAGE:
					const { message } = onMessageUpdate as NewMessageOutput;
					const newMessage = {
						...message,
						node: {
							...message.node,
							// FIXME Sason - Figure out why apollo converts createdAt(Date type) to null in response
							createdAt: new Date().toISOString()
						}
					};
					const updatedMessages = produce(prevData, draft => {
						draft.chat.messages.edges.push(newMessage);
					});
					client.writeQuery({
						...query,
						data: {
							...updatedMessages
						}
					});
					break;

				case SubscriptionTypesEnum.MESSAGE_DELETED: {
					const { messageId } = onMessageUpdate as MessageDeletedOutput;
					setDeletedMessages({
						...deletedMessages,
						[messageId]: true
					});
					break;
				}

				case SubscriptionTypesEnum.MESSAGE_EDITED:
				case SubscriptionTypesEnum.FILE_UPLOADED: {
					const { messageId } = onMessageUpdate as
						| MessageEditedOutput
						| FileUploadedOutput;
					const targetMessageIndex = prevData.chat.messages.edges.findIndex(
						({ cursor }) => cursor === messageId
					);
					let updatedMessages = null;

					if (updateType === SubscriptionTypesEnum.MESSAGE_EDITED) {
						updatedMessages = produce(prevData, draft => {
							draft.chat.messages.edges[
								targetMessageIndex
							].node.text = (onMessageUpdate as MessageEditedOutput).updatedText;
						});
					}

					if (updateType === SubscriptionTypesEnum.FILE_UPLOADED) {
						updatedMessages = produce(prevData, draft => {
							draft.chat.messages.edges[
								targetMessageIndex
							].node.file = (onMessageUpdate as FileUploadedOutput).file;
						});
					}

					client.writeQuery({
						...query,
						data: {
							...updatedMessages
						}
					});
				}
			}
		}
	});
	return (
		<MessagesList
			{...result}
			messages={loading ? [] : (data.chat.messages.edges as MessageEdge[])}
			storeMessages={loading ? false : data.chat.storeMessages}
			deletedMessages={deletedMessages}
			loading={loading}
			chatSlug={chatSlug}
			isFetching={isFetching}
			isMoreMessagesToFetch={isMoreMessagesToFetch}
			setIsMoreMessagesToFetch={setIsMoreMessagesToFetch}
			found={!!(!loading && data && data.chat)}
			currentUser={currentUser as User}
			fetchOlderMessages={async (cursor: string) => {
				setIsFetching(true);
				await fetchMore({
					variables: { chatSlug, first: 20, before: cursor },
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
		/>
	);
};

export default React.memo(MessagesListData);
