import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
	DateTime: any;
	/** The `Upload` scalar type represents a file upload. */
	Upload: any;
};

export type Chat = {
	__typename?: 'Chat';
	_id: Scalars['ID'];
	name: Scalars['String'];
	slug: Scalars['String'];
	image: File;
	isPrivate: Scalars['Boolean'];
	storeMessages: Scalars['Boolean'];
	moderators: Array<User>;
	allowedUsers: Array<User>;
	createdBy: User;
	lastMessage?: Maybe<Scalars['String']>;
	messages: MessageConnection;
};

export type ChatMessagesArgs = {
	before?: Maybe<Scalars['String']>;
	after?: Maybe<Scalars['String']>;
	last?: Maybe<Scalars['Float']>;
	first?: Maybe<Scalars['Float']>;
};

export type CreateChatInput = {
	name: Scalars['String'];
	isPrivate: Scalars['Boolean'];
	storeMessages: Scalars['Boolean'];
};

export type CreatedBy = {
	__typename?: 'CreatedBy';
	_id: Scalars['String'];
	displayName: Scalars['String'];
	slug: Scalars['String'];
	avatar: Scalars['String'];
};

export type File = {
	__typename?: 'File';
	_id: Scalars['ID'];
	mimeType?: Maybe<Scalars['String']>;
	path: Scalars['String'];
	isStoredRemotely: Scalars['Boolean'];
	dimensions: FileDimensions;
};

export type FileAddedOutput = {
	__typename?: 'FileAddedOutput';
	chatSlug: Scalars['String'];
	messageId: Scalars['String'];
};

export type FileDimensions = {
	__typename?: 'FileDimensions';
	height?: Maybe<Scalars['Int']>;
	width?: Maybe<Scalars['Int']>;
};

export type LoginInput = {
	email: Scalars['String'];
	password: Scalars['String'];
};

export type Mention = {
	__typename?: 'Mention';
	_id: Scalars['ID'];
	indices: Array<Scalars['Int']>;
	displayName: Scalars['String'];
	slug: Scalars['String'];
};

export type Message = {
	__typename?: 'Message';
	_id?: Maybe<Scalars['ID']>;
	text: Scalars['String'];
	chatSlug: Scalars['String'];
	file?: Maybe<File>;
	createdBy: CreatedBy;
	userMentions?: Maybe<Array<Mention>>;
	creationToken?: Maybe<Scalars['String']>;
	isClientDeleted?: Maybe<Scalars['Boolean']>;
	createdAt: Scalars['DateTime'];
};

export type MessageConnection = {
	__typename?: 'MessageConnection';
	edges: Array<MessageEdge>;
	pageInfo: PageInfo;
};

export type MessageEdge = {
	__typename?: 'MessageEdge';
	cursor: Scalars['String'];
	node: Message;
};

export type Mutation = {
	__typename?: 'Mutation';
	createChatRoom: Chat;
	postMessage?: Maybe<Message>;
	updateMessage: Scalars['Boolean'];
	uploadMessageFile: Scalars['Boolean'];
	updateActiveUsers?: Maybe<Scalars['Boolean']>;
	updateTypingUsers?: Maybe<Scalars['Boolean']>;
	register: Scalars['Boolean'];
	login?: Maybe<Scalars['String']>;
	loginWithGoogle?: Maybe<Scalars['String']>;
	createRestPasswordToken: Scalars['String'];
	changePassword: Scalars['Boolean'];
};

export type MutationCreateChatRoomArgs = {
	data: CreateChatInput;
};

export type MutationPostMessageArgs = {
	chatSlug: Scalars['String'];
	text: Scalars['String'];
};

export type MutationUpdateMessageArgs = {
	updatePayload: UpdateMessageInput;
};

export type MutationUploadMessageFileArgs = {
	messageId: Scalars['String'];
	chatSlug: Scalars['String'];
	file: Scalars['Upload'];
};

export type MutationUpdateActiveUsersArgs = {
	crudType: Scalars['String'];
	chatSlug: Scalars['String'];
};

export type MutationUpdateTypingUsersArgs = {
	crudType: Scalars['String'];
	chatSlug: Scalars['String'];
};

export type MutationRegisterArgs = {
	data: RegisterInput;
};

export type MutationLoginArgs = {
	data: LoginInput;
};

export type MutationLoginWithGoogleArgs = {
	token: Scalars['String'];
};

export type MutationCreateRestPasswordTokenArgs = {
	email: Scalars['String'];
};

export type MutationChangePasswordArgs = {
	newPassword: Scalars['String'];
	token?: Maybe<Scalars['String']>;
};

export type Notification = {
	__typename?: 'Notification';
	_id: Scalars['ID'];
	sender: User;
	receiver: User;
	content: Scalars['String'];
	type: Scalars['String'];
	ref: Scalars['String'];
	isRead: Scalars['Boolean'];
};

export type PageInfo = {
	__typename?: 'PageInfo';
	hasNextPage: Scalars['Boolean'];
	hasPreviousPage: Scalars['Boolean'];
};

export type Query = {
	__typename?: 'Query';
	chat: Chat;
	olderMessages?: Maybe<Array<Message>>;
	roomsList: Array<Chat>;
	validateResetPasswordToken: Scalars['Boolean'];
	me: User;
	user?: Maybe<User>;
	users: SearchUsersOutput;
	notifications: Array<Notification>;
};

export type QueryChatArgs = {
	chatSlug: Scalars['String'];
};

export type QueryOlderMessagesArgs = {
	chatSlug: Scalars['String'];
	beforeMessageId: Scalars['ID'];
};

export type QueryValidateResetPasswordTokenArgs = {
	token: Scalars['String'];
};

export type QueryUserArgs = {
	slug: Scalars['String'];
};

export type QueryUsersArgs = {
	limit?: Maybe<Scalars['Int']>;
	displayName: Scalars['String'];
};

export type RegisterInput = {
	displayName: Scalars['String'];
	email: Scalars['String'];
	password: Scalars['String'];
	captcha: Scalars['String'];
};

export type SearchUsersOutput = {
	__typename?: 'SearchUsersOutput';
	userList: Array<User>;
	searchToken: Scalars['String'];
};

export type Subscription = {
	__typename?: 'Subscription';
	onNewMessage?: Maybe<Message>;
	onActiveUsersUpdate?: Maybe<Array<User>>;
	onMessageUpdate: Scalars['String'];
	onTypingUsersUpdate?: Maybe<UserTypingOutput>;
	userUpdates: Scalars['String'];
};

export type SubscriptionOnNewMessageArgs = {
	chatSlug: Scalars['String'];
};

export type SubscriptionOnActiveUsersUpdateArgs = {
	chatSlug: Scalars['String'];
};

export type SubscriptionOnMessageUpdateArgs = {
	chatSlug: Scalars['String'];
};

export type UpdateMessageInput = {
	messageId: Scalars['ID'];
	crudType: Scalars['String'];
	messageText?: Maybe<Scalars['String']>;
	creationToken?: Maybe<Scalars['String']>;
	chatSlug: Scalars['String'];
};

export type User = {
	__typename?: 'User';
	_id: Scalars['ID'];
	displayName: Scalars['String'];
	email: Scalars['String'];
	slug: Scalars['String'];
	avatar: Scalars['String'];
	notifications: Array<Notification>;
	role: Scalars['String'];
	permissions: Array<Scalars['String']>;
	excludedPermissions: Array<Scalars['String']>;
	ipAddress: Scalars['String'];
	lastActivity: Scalars['DateTime'];
	unreadNotificationsCount: Scalars['Int'];
	createdChatRooms?: Maybe<Array<Chat>>;
	createdAt: Scalars['DateTime'];
};

export type UserTypingOutput = {
	__typename?: 'UserTypingOutput';
	chatSlug: Scalars['String'];
	crudType: Scalars['String'];
	user: User;
};
export type MessageAttributesFragment = { __typename?: 'Message' } & Pick<
	Message,
	| '_id'
	| 'text'
	| 'isClientDeleted'
	| 'creationToken'
	| 'chatSlug'
	| 'createdAt'
> & {
		createdBy: { __typename?: 'CreatedBy' } & Pick<
			CreatedBy,
			'displayName' | 'avatar' | 'slug'
		>;
		file: Maybe<
			{ __typename?: 'File' } & Pick<File, 'path'> & {
					dimensions: { __typename?: 'FileDimensions' } & Pick<
						FileDimensions,
						'height' | 'width'
					>;
				}
		>;
		userMentions: Maybe<
			Array<
				{ __typename?: 'Mention' } & Pick<
					Mention,
					'displayName' | 'indices' | 'slug'
				>
			>
		>;
	};

export type PostMessageMutationVariables = {
	chatSlug: Scalars['String'];
	text: Scalars['String'];
};

export type PostMessageMutation = { __typename?: 'Mutation' } & {
	postMessage: Maybe<{ __typename?: 'Message' } & Pick<Message, '_id'>>;
};

export type UpdateActiveUsersMutationVariables = {
	chatSlug: Scalars['String'];
	crudType: Scalars['String'];
};

export type UpdateActiveUsersMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'updateActiveUsers'
>;

export type GetMessagesQueryVariables = {
	chatSlug: Scalars['String'];
};

export type GetMessagesQuery = { __typename?: 'Query' } & {
	chat: { __typename?: 'Chat' } & Pick<Chat, 'storeMessages'> & {
			messages: { __typename?: 'MessageConnection' } & {
				edges: Array<
					{ __typename?: 'MessageEdge' } & Pick<MessageEdge, 'cursor'> & {
							node: { __typename?: 'Message' } & MessageAttributesFragment;
						}
				>;
				pageInfo: { __typename?: 'PageInfo' } & Pick<
					PageInfo,
					'hasNextPage' | 'hasPreviousPage'
				>;
			};
		};
};

export type GetNotificationsQueryVariables = {};

export type GetNotificationsQuery = { __typename?: 'Query' } & {
	notifications: Array<
		{ __typename?: 'Notification' } & Pick<
			Notification,
			'_id' | 'ref' | 'type'
		> & { sender: { __typename?: 'User' } & Pick<User, 'displayName' | 'slug'> }
	>;
};

export type GetRoomsListQueryVariables = {};

export type GetRoomsListQuery = { __typename?: 'Query' } & {
	roomsList: Array<
		{ __typename?: 'Chat' } & Pick<
			Chat,
			'_id' | 'name' | 'slug' | 'lastMessage'
		> & { image: { __typename?: 'File' } & Pick<File, 'path'> }
	>;
};

export type GetUserQueryVariables = {
	slug: Scalars['String'];
};

export type GetUserQuery = { __typename?: 'Query' } & {
	user: Maybe<
		{ __typename?: 'User' } & Pick<
			User,
			'displayName' | 'avatar' | 'email' | 'createdAt'
		>
	>;
};

export type GetUsersQueryVariables = {
	limit?: Maybe<Scalars['Int']>;
	displayName: Scalars['String'];
};

export type GetUsersQuery = { __typename?: 'Query' } & {
	users: { __typename?: 'SearchUsersOutput' } & Pick<
		SearchUsersOutput,
		'searchToken'
	> & {
			userList: Array<
				{ __typename?: 'User' } & Pick<User, 'displayName' | 'slug' | 'avatar'>
			>;
		};
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: 'Query' } & {
	me: { __typename?: 'User' } & Pick<User, 'unreadNotificationsCount'>;
};

export type ActiveUsersUpdatesSubscriptionVariables = {
	chatSlug: Scalars['String'];
};

export type ActiveUsersUpdatesSubscription = { __typename?: 'Subscription' } & {
	onActiveUsersUpdate: Maybe<
		Array<
			{ __typename?: 'User' } & Pick<User, 'displayName' | 'avatar' | 'slug'>
		>
	>;
};

export type ChatMessageUpdatesSubscriptionVariables = {
	chatSlug: Scalars['String'];
};

export type ChatMessageUpdatesSubscription = {
	__typename?: 'Subscription';
} & Pick<Subscription, 'onMessageUpdate'>;

export type TypingUsersUpdatesSubscriptionVariables = {};

export type TypingUsersUpdatesSubscription = { __typename?: 'Subscription' } & {
	onTypingUsersUpdate: Maybe<
		{ __typename?: 'UserTypingOutput' } & Pick<
			UserTypingOutput,
			'crudType' | 'chatSlug'
		> & { user: { __typename?: 'User' } & Pick<User, 'displayName' | 'slug'> }
	>;
};

export type UserUpdatesSubscriptionVariables = {};

export type UserUpdatesSubscription = { __typename?: 'Subscription' } & Pick<
	Subscription,
	'userUpdates'
>;
export const MessageAttributesFragmentDoc = gql`
	fragment messageAttributes on Message {
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
export const PostMessageDocument = gql`
	mutation PostMessage($chatSlug: String!, $text: String!) {
		postMessage(text: $text, chatSlug: $chatSlug) {
			_id
		}
	}
`;
export type PostMessageMutationFn = ApolloReactCommon.MutationFunction<
	PostMessageMutation,
	PostMessageMutationVariables
>;

export function usePostMessageMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		PostMessageMutation,
		PostMessageMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		PostMessageMutation,
		PostMessageMutationVariables
	>(PostMessageDocument, baseOptions);
}
export type PostMessageMutationHookResult = ReturnType<
	typeof usePostMessageMutation
>;
export type PostMessageMutationResult = ApolloReactCommon.MutationResult<
	PostMessageMutation
>;
export type PostMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
	PostMessageMutation,
	PostMessageMutationVariables
>;
export const UpdateActiveUsersDocument = gql`
	mutation UpdateActiveUsers($chatSlug: String!, $crudType: String!) {
		updateActiveUsers(chatSlug: $chatSlug, crudType: $crudType)
	}
`;
export type UpdateActiveUsersMutationFn = ApolloReactCommon.MutationFunction<
	UpdateActiveUsersMutation,
	UpdateActiveUsersMutationVariables
>;

export function useUpdateActiveUsersMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		UpdateActiveUsersMutation,
		UpdateActiveUsersMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		UpdateActiveUsersMutation,
		UpdateActiveUsersMutationVariables
	>(UpdateActiveUsersDocument, baseOptions);
}
export type UpdateActiveUsersMutationHookResult = ReturnType<
	typeof useUpdateActiveUsersMutation
>;
export type UpdateActiveUsersMutationResult = ApolloReactCommon.MutationResult<
	UpdateActiveUsersMutation
>;
export type UpdateActiveUsersMutationOptions = ApolloReactCommon.BaseMutationOptions<
	UpdateActiveUsersMutation,
	UpdateActiveUsersMutationVariables
>;
export const GetMessagesDocument = gql`
	query GetMessages($chatSlug: String!) {
		chat(chatSlug: $chatSlug) {
			storeMessages
			messages(first: 20) {
				edges {
					cursor
					node {
						...messageAttributes
					}
				}
				pageInfo {
					hasNextPage
					hasPreviousPage
				}
			}
		}
	}
	${MessageAttributesFragmentDoc}
`;

export function useGetMessagesQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		GetMessagesQuery,
		GetMessagesQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(
		GetMessagesDocument,
		baseOptions
	);
}
export function useGetMessagesLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		GetMessagesQuery,
		GetMessagesQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		GetMessagesQuery,
		GetMessagesQueryVariables
	>(GetMessagesDocument, baseOptions);
}

export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesQueryResult = ApolloReactCommon.QueryResult<
	GetMessagesQuery,
	GetMessagesQueryVariables
>;
export const GetNotificationsDocument = gql`
	query GetNotifications {
		notifications {
			_id
			ref
			sender {
				displayName
				slug
			}
			type
		}
	}
`;

export function useGetNotificationsQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		GetNotificationsQuery,
		GetNotificationsQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		GetNotificationsQuery,
		GetNotificationsQueryVariables
	>(GetNotificationsDocument, baseOptions);
}
export function useGetNotificationsLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		GetNotificationsQuery,
		GetNotificationsQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		GetNotificationsQuery,
		GetNotificationsQueryVariables
	>(GetNotificationsDocument, baseOptions);
}

export type GetNotificationsQueryHookResult = ReturnType<
	typeof useGetNotificationsQuery
>;
export type GetNotificationsQueryResult = ApolloReactCommon.QueryResult<
	GetNotificationsQuery,
	GetNotificationsQueryVariables
>;
export const GetRoomsListDocument = gql`
	query GetRoomsList {
		roomsList {
			_id
			name
			image {
				path
			}
			slug
			lastMessage
		}
	}
`;

export function useGetRoomsListQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		GetRoomsListQuery,
		GetRoomsListQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		GetRoomsListQuery,
		GetRoomsListQueryVariables
	>(GetRoomsListDocument, baseOptions);
}
export function useGetRoomsListLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		GetRoomsListQuery,
		GetRoomsListQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		GetRoomsListQuery,
		GetRoomsListQueryVariables
	>(GetRoomsListDocument, baseOptions);
}

export type GetRoomsListQueryHookResult = ReturnType<
	typeof useGetRoomsListQuery
>;
export type GetRoomsListQueryResult = ApolloReactCommon.QueryResult<
	GetRoomsListQuery,
	GetRoomsListQueryVariables
>;
export const GetUserDocument = gql`
	query GetUser($slug: String!) {
		user(slug: $slug) {
			displayName
			avatar
			email
			createdAt
		}
	}
`;

export function useGetUserQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		GetUserQuery,
		GetUserQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<GetUserQuery, GetUserQueryVariables>(
		GetUserDocument,
		baseOptions
	);
}
export function useGetUserLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		GetUserQuery,
		GetUserQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<GetUserQuery, GetUserQueryVariables>(
		GetUserDocument,
		baseOptions
	);
}

export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<
	GetUserQuery,
	GetUserQueryVariables
>;
export const GetUsersDocument = gql`
	query GetUsers($limit: Int, $displayName: String!) {
		users(displayName: $displayName, limit: $limit) {
			searchToken
			userList {
				displayName
				slug
				avatar
			}
		}
	}
`;

export function useGetUsersQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		GetUsersQuery,
		GetUsersQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<GetUsersQuery, GetUsersQueryVariables>(
		GetUsersDocument,
		baseOptions
	);
}
export function useGetUsersLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		GetUsersQuery,
		GetUsersQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(
		GetUsersDocument,
		baseOptions
	);
}

export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersQueryResult = ApolloReactCommon.QueryResult<
	GetUsersQuery,
	GetUsersQueryVariables
>;
export const MeDocument = gql`
	query Me {
		me {
			unreadNotificationsCount
		}
	}
`;

export function useMeQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>
) {
	return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(
		MeDocument,
		baseOptions
	);
}
export function useMeLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
	return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(
		MeDocument,
		baseOptions
	);
}

export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<
	MeQuery,
	MeQueryVariables
>;
export const ActiveUsersUpdatesDocument = gql`
	subscription ActiveUsersUpdates($chatSlug: String!) {
		onActiveUsersUpdate(chatSlug: $chatSlug) {
			displayName
			avatar
			slug
		}
	}
`;

export function useActiveUsersUpdatesSubscription(
	baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
		ActiveUsersUpdatesSubscription,
		ActiveUsersUpdatesSubscriptionVariables
	>
) {
	return ApolloReactHooks.useSubscription<
		ActiveUsersUpdatesSubscription,
		ActiveUsersUpdatesSubscriptionVariables
	>(ActiveUsersUpdatesDocument, baseOptions);
}
export type ActiveUsersUpdatesSubscriptionHookResult = ReturnType<
	typeof useActiveUsersUpdatesSubscription
>;
export type ActiveUsersUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<
	ActiveUsersUpdatesSubscription
>;
export const ChatMessageUpdatesDocument = gql`
	subscription ChatMessageUpdates($chatSlug: String!) {
		onMessageUpdate(chatSlug: $chatSlug)
	}
`;

export function useChatMessageUpdatesSubscription(
	baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
		ChatMessageUpdatesSubscription,
		ChatMessageUpdatesSubscriptionVariables
	>
) {
	return ApolloReactHooks.useSubscription<
		ChatMessageUpdatesSubscription,
		ChatMessageUpdatesSubscriptionVariables
	>(ChatMessageUpdatesDocument, baseOptions);
}
export type ChatMessageUpdatesSubscriptionHookResult = ReturnType<
	typeof useChatMessageUpdatesSubscription
>;
export type ChatMessageUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<
	ChatMessageUpdatesSubscription
>;
export const TypingUsersUpdatesDocument = gql`
	subscription TypingUsersUpdates {
		onTypingUsersUpdate {
			crudType
			chatSlug
			user {
				displayName
				slug
			}
		}
	}
`;

export function useTypingUsersUpdatesSubscription(
	baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
		TypingUsersUpdatesSubscription,
		TypingUsersUpdatesSubscriptionVariables
	>
) {
	return ApolloReactHooks.useSubscription<
		TypingUsersUpdatesSubscription,
		TypingUsersUpdatesSubscriptionVariables
	>(TypingUsersUpdatesDocument, baseOptions);
}
export type TypingUsersUpdatesSubscriptionHookResult = ReturnType<
	typeof useTypingUsersUpdatesSubscription
>;
export type TypingUsersUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<
	TypingUsersUpdatesSubscription
>;
export const UserUpdatesDocument = gql`
	subscription UserUpdates {
		userUpdates
	}
`;

export function useUserUpdatesSubscription(
	baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
		UserUpdatesSubscription,
		UserUpdatesSubscriptionVariables
	>
) {
	return ApolloReactHooks.useSubscription<
		UserUpdatesSubscription,
		UserUpdatesSubscriptionVariables
	>(UserUpdatesDocument, baseOptions);
}
export type UserUpdatesSubscriptionHookResult = ReturnType<
	typeof useUserUpdatesSubscription
>;
export type UserUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<
	UserUpdatesSubscription
>;
