import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
// Generated in 2019-09-28T20:12:11+03:00
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
	last?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
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
	updateCurrentUser?: Maybe<User>;
	setNotificationsData?: Maybe<Scalars['Boolean']>;
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

export type MutationUpdateCurrentUserArgs = {
	user?: Maybe<UserInput>;
};

export type MutationSetNotificationsDataArgs = {
	data?: Maybe<NotificationsDataInput>;
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

export type NotificationsData = {
	__typename?: 'NotificationsData';
	unreadCount: Scalars['Int'];
	list: Array<Notification>;
};

export type NotificationsDataInput = {
	unreadCount?: Maybe<Scalars['Int']>;
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
	currentUser?: Maybe<User>;
	notificationsData?: Maybe<NotificationsData>;
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

export type UserInput = {
	_id: Scalars['ID'];
	displayName: Scalars['String'];
	slug: Scalars['String'];
	avatar: Scalars['String'];
	email: Scalars['String'];
	role: Scalars['String'];
};

export type UserTypingOutput = {
	__typename?: 'UserTypingOutput';
	chatSlug: Scalars['String'];
	crudType: Scalars['String'];
	user: User;
};
export type Client__SetNotificationsDataMutationVariables = {
	data?: Maybe<NotificationsDataInput>;
};

export type Client__SetNotificationsDataMutation = {
	__typename?: 'Mutation';
} & Pick<Mutation, 'setNotificationsData'>;

export type Client__UpdateCurrentUserMutationVariables = {
	user?: Maybe<UserInput>;
};

export type Client__UpdateCurrentUserMutation = { __typename?: 'Mutation' } & {
	updateCurrentUser: Maybe<{ __typename?: 'User' } & Pick<User, '_id'>>;
};

export type Client__GetCurrentUserQueryVariables = {};

export type Client__GetCurrentUserQuery = { __typename?: 'Query' } & {
	currentUser: Maybe<{ __typename?: 'User' } & UserAttributesFragment>;
};

export type Client__GetNotificationsDataQueryVariables = {};

export type Client__GetNotificationsDataQuery = { __typename?: 'Query' } & {
	notificationsData: Maybe<
		{ __typename?: 'NotificationsData' } & Pick<
			NotificationsData,
			'unreadCount'
		>
	>;
};

export type MessageAttributesFragment = { __typename?: 'Message' } & Pick<
	Message,
	'_id' | 'text' | 'creationToken' | 'chatSlug' | 'createdAt'
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

export type UserAttributesFragment = { __typename?: 'User' } & Pick<
	User,
	'_id' | 'displayName' | 'slug' | 'avatar' | 'email' | 'role'
>;

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
	first?: Maybe<Scalars['Int']>;
	last?: Maybe<Scalars['Int']>;
	before?: Maybe<Scalars['String']>;
	after?: Maybe<Scalars['String']>;
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

export type UpdateMessageMutationVariables = {
	messageId: Scalars['ID'];
	crudType: Scalars['String'];
	messageText?: Maybe<Scalars['String']>;
	creationToken?: Maybe<Scalars['String']>;
	chatSlug: Scalars['String'];
};

export type UpdateMessageMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'updateMessage'
>;

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
export const UserAttributesFragmentDoc = gql`
	fragment userAttributes on User {
		_id
		displayName
		slug
		avatar
		email
		role
	}
`;
export const Client__SetNotificationsDataDocument = gql`
	mutation Client__SetNotificationsData($data: NotificationsDataInput) {
		setNotificationsData(data: $data) @client
	}
`;
export type Client__SetNotificationsDataMutationFn = ApolloReactCommon.MutationFunction<
	Client__SetNotificationsDataMutation,
	Client__SetNotificationsDataMutationVariables
>;
export type Client__SetNotificationsDataProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	Client__SetNotificationsDataMutation,
	Client__SetNotificationsDataMutationVariables
> &
	TChildProps;
export function withClient__SetNotificationsData<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		Client__SetNotificationsDataMutation,
		Client__SetNotificationsDataMutationVariables,
		Client__SetNotificationsDataProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		Client__SetNotificationsDataMutation,
		Client__SetNotificationsDataMutationVariables,
		Client__SetNotificationsDataProps<TChildProps>
	>(Client__SetNotificationsDataDocument, {
		alias: 'clientSetNotificationsData',
		...operationOptions
	});
}

export function useClient__SetNotificationsDataMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		Client__SetNotificationsDataMutation,
		Client__SetNotificationsDataMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		Client__SetNotificationsDataMutation,
		Client__SetNotificationsDataMutationVariables
	>(Client__SetNotificationsDataDocument, baseOptions);
}
export type Client__SetNotificationsDataMutationHookResult = ReturnType<
	typeof useClient__SetNotificationsDataMutation
>;
export type Client__SetNotificationsDataMutationResult = ApolloReactCommon.MutationResult<
	Client__SetNotificationsDataMutation
>;
export type Client__SetNotificationsDataMutationOptions = ApolloReactCommon.BaseMutationOptions<
	Client__SetNotificationsDataMutation,
	Client__SetNotificationsDataMutationVariables
>;
export const Client__UpdateCurrentUserDocument = gql`
	mutation Client__UpdateCurrentUser($user: UserInput) {
		updateCurrentUser(user: $user) @client {
			_id
		}
	}
`;
export type Client__UpdateCurrentUserMutationFn = ApolloReactCommon.MutationFunction<
	Client__UpdateCurrentUserMutation,
	Client__UpdateCurrentUserMutationVariables
>;
export type Client__UpdateCurrentUserProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	Client__UpdateCurrentUserMutation,
	Client__UpdateCurrentUserMutationVariables
> &
	TChildProps;
export function withClient__UpdateCurrentUser<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		Client__UpdateCurrentUserMutation,
		Client__UpdateCurrentUserMutationVariables,
		Client__UpdateCurrentUserProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		Client__UpdateCurrentUserMutation,
		Client__UpdateCurrentUserMutationVariables,
		Client__UpdateCurrentUserProps<TChildProps>
	>(Client__UpdateCurrentUserDocument, {
		alias: 'clientUpdateCurrentUser',
		...operationOptions
	});
}

export function useClient__UpdateCurrentUserMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		Client__UpdateCurrentUserMutation,
		Client__UpdateCurrentUserMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		Client__UpdateCurrentUserMutation,
		Client__UpdateCurrentUserMutationVariables
	>(Client__UpdateCurrentUserDocument, baseOptions);
}
export type Client__UpdateCurrentUserMutationHookResult = ReturnType<
	typeof useClient__UpdateCurrentUserMutation
>;
export type Client__UpdateCurrentUserMutationResult = ApolloReactCommon.MutationResult<
	Client__UpdateCurrentUserMutation
>;
export type Client__UpdateCurrentUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
	Client__UpdateCurrentUserMutation,
	Client__UpdateCurrentUserMutationVariables
>;
export const Client__GetCurrentUserDocument = gql`
	query Client__GetCurrentUser {
		currentUser @client {
			...userAttributes
		}
	}
	${UserAttributesFragmentDoc}
`;
export type Client__GetCurrentUserProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	Client__GetCurrentUserQuery,
	Client__GetCurrentUserQueryVariables
> &
	TChildProps;
export function withClient__GetCurrentUser<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		Client__GetCurrentUserQuery,
		Client__GetCurrentUserQueryVariables,
		Client__GetCurrentUserProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		Client__GetCurrentUserQuery,
		Client__GetCurrentUserQueryVariables,
		Client__GetCurrentUserProps<TChildProps>
	>(Client__GetCurrentUserDocument, {
		alias: 'clientGetCurrentUser',
		...operationOptions
	});
}

export function useClient__GetCurrentUserQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		Client__GetCurrentUserQuery,
		Client__GetCurrentUserQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		Client__GetCurrentUserQuery,
		Client__GetCurrentUserQueryVariables
	>(Client__GetCurrentUserDocument, baseOptions);
}
export function useClient__GetCurrentUserLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		Client__GetCurrentUserQuery,
		Client__GetCurrentUserQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		Client__GetCurrentUserQuery,
		Client__GetCurrentUserQueryVariables
	>(Client__GetCurrentUserDocument, baseOptions);
}

export type Client__GetCurrentUserQueryHookResult = ReturnType<
	typeof useClient__GetCurrentUserQuery
>;
export type Client__GetCurrentUserQueryResult = ApolloReactCommon.QueryResult<
	Client__GetCurrentUserQuery,
	Client__GetCurrentUserQueryVariables
>;
export const Client__GetNotificationsDataDocument = gql`
	query client__GetNotificationsData {
		notificationsData @client {
			unreadCount
		}
	}
`;
export type Client__GetNotificationsDataProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	Client__GetNotificationsDataQuery,
	Client__GetNotificationsDataQueryVariables
> &
	TChildProps;
export function withClient__GetNotificationsData<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		Client__GetNotificationsDataQuery,
		Client__GetNotificationsDataQueryVariables,
		Client__GetNotificationsDataProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		Client__GetNotificationsDataQuery,
		Client__GetNotificationsDataQueryVariables,
		Client__GetNotificationsDataProps<TChildProps>
	>(Client__GetNotificationsDataDocument, {
		alias: 'clientGetNotificationsData',
		...operationOptions
	});
}

export function useClient__GetNotificationsDataQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		Client__GetNotificationsDataQuery,
		Client__GetNotificationsDataQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		Client__GetNotificationsDataQuery,
		Client__GetNotificationsDataQueryVariables
	>(Client__GetNotificationsDataDocument, baseOptions);
}
export function useClient__GetNotificationsDataLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		Client__GetNotificationsDataQuery,
		Client__GetNotificationsDataQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		Client__GetNotificationsDataQuery,
		Client__GetNotificationsDataQueryVariables
	>(Client__GetNotificationsDataDocument, baseOptions);
}

export type Client__GetNotificationsDataQueryHookResult = ReturnType<
	typeof useClient__GetNotificationsDataQuery
>;
export type Client__GetNotificationsDataQueryResult = ApolloReactCommon.QueryResult<
	Client__GetNotificationsDataQuery,
	Client__GetNotificationsDataQueryVariables
>;
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
export type PostMessageProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
	PostMessageMutation,
	PostMessageMutationVariables
> &
	TChildProps;
export function withPostMessage<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		PostMessageMutation,
		PostMessageMutationVariables,
		PostMessageProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		PostMessageMutation,
		PostMessageMutationVariables,
		PostMessageProps<TChildProps>
	>(PostMessageDocument, {
		alias: 'postMessage',
		...operationOptions
	});
}

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
export type UpdateActiveUsersProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	UpdateActiveUsersMutation,
	UpdateActiveUsersMutationVariables
> &
	TChildProps;
export function withUpdateActiveUsers<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		UpdateActiveUsersMutation,
		UpdateActiveUsersMutationVariables,
		UpdateActiveUsersProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		UpdateActiveUsersMutation,
		UpdateActiveUsersMutationVariables,
		UpdateActiveUsersProps<TChildProps>
	>(UpdateActiveUsersDocument, {
		alias: 'updateActiveUsers',
		...operationOptions
	});
}

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
	query GetMessages(
		$chatSlug: String!
		$first: Int
		$last: Int
		$before: String
		$after: String
	) {
		chat(chatSlug: $chatSlug) {
			storeMessages
			messages(first: $first, last: $last, before: $before, after: $after) {
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
export type GetMessagesProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	GetMessagesQuery,
	GetMessagesQueryVariables
> &
	TChildProps;
export function withGetMessages<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		GetMessagesQuery,
		GetMessagesQueryVariables,
		GetMessagesProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		GetMessagesQuery,
		GetMessagesQueryVariables,
		GetMessagesProps<TChildProps>
	>(GetMessagesDocument, {
		alias: 'getMessages',
		...operationOptions
	});
}

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
export type GetNotificationsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	GetNotificationsQuery,
	GetNotificationsQueryVariables
> &
	TChildProps;
export function withGetNotifications<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		GetNotificationsQuery,
		GetNotificationsQueryVariables,
		GetNotificationsProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		GetNotificationsQuery,
		GetNotificationsQueryVariables,
		GetNotificationsProps<TChildProps>
	>(GetNotificationsDocument, {
		alias: 'getNotifications',
		...operationOptions
	});
}

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
export type GetRoomsListProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	GetRoomsListQuery,
	GetRoomsListQueryVariables
> &
	TChildProps;
export function withGetRoomsList<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		GetRoomsListQuery,
		GetRoomsListQueryVariables,
		GetRoomsListProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		GetRoomsListQuery,
		GetRoomsListQueryVariables,
		GetRoomsListProps<TChildProps>
	>(GetRoomsListDocument, {
		alias: 'getRoomsList',
		...operationOptions
	});
}

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
export type GetUserProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	GetUserQuery,
	GetUserQueryVariables
> &
	TChildProps;
export function withGetUser<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		GetUserQuery,
		GetUserQueryVariables,
		GetUserProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		GetUserQuery,
		GetUserQueryVariables,
		GetUserProps<TChildProps>
	>(GetUserDocument, {
		alias: 'getUser',
		...operationOptions
	});
}

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
export type GetUsersProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	GetUsersQuery,
	GetUsersQueryVariables
> &
	TChildProps;
export function withGetUsers<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		GetUsersQuery,
		GetUsersQueryVariables,
		GetUsersProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		GetUsersQuery,
		GetUsersQueryVariables,
		GetUsersProps<TChildProps>
	>(GetUsersDocument, {
		alias: 'getUsers',
		...operationOptions
	});
}

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
export type MeProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	MeQuery,
	MeQueryVariables
> &
	TChildProps;
export function withMe<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		MeQuery,
		MeQueryVariables,
		MeProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		MeQuery,
		MeQueryVariables,
		MeProps<TChildProps>
	>(MeDocument, {
		alias: 'me',
		...operationOptions
	});
}

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
export const UpdateMessageDocument = gql`
	mutation UpdateMessage(
		$messageId: ID!
		$crudType: String!
		$messageText: String
		$creationToken: String
		$chatSlug: String!
	) {
		updateMessage(
			updatePayload: {
				messageId: $messageId
				crudType: $crudType
				messageText: $messageText
				creationToken: $creationToken
				chatSlug: $chatSlug
			}
		)
	}
`;
export type UpdateMessageMutationFn = ApolloReactCommon.MutationFunction<
	UpdateMessageMutation,
	UpdateMessageMutationVariables
>;
export type UpdateMessageProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
	UpdateMessageMutation,
	UpdateMessageMutationVariables
> &
	TChildProps;
export function withUpdateMessage<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		UpdateMessageMutation,
		UpdateMessageMutationVariables,
		UpdateMessageProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		UpdateMessageMutation,
		UpdateMessageMutationVariables,
		UpdateMessageProps<TChildProps>
	>(UpdateMessageDocument, {
		alias: 'updateMessage',
		...operationOptions
	});
}

export function useUpdateMessageMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		UpdateMessageMutation,
		UpdateMessageMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		UpdateMessageMutation,
		UpdateMessageMutationVariables
	>(UpdateMessageDocument, baseOptions);
}
export type UpdateMessageMutationHookResult = ReturnType<
	typeof useUpdateMessageMutation
>;
export type UpdateMessageMutationResult = ApolloReactCommon.MutationResult<
	UpdateMessageMutation
>;
export type UpdateMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
	UpdateMessageMutation,
	UpdateMessageMutationVariables
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
export type ActiveUsersUpdatesProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	ActiveUsersUpdatesSubscription,
	ActiveUsersUpdatesSubscriptionVariables
> &
	TChildProps;
export function withActiveUsersUpdates<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		ActiveUsersUpdatesSubscription,
		ActiveUsersUpdatesSubscriptionVariables,
		ActiveUsersUpdatesProps<TChildProps>
	>
) {
	return ApolloReactHoc.withSubscription<
		TProps,
		ActiveUsersUpdatesSubscription,
		ActiveUsersUpdatesSubscriptionVariables,
		ActiveUsersUpdatesProps<TChildProps>
	>(ActiveUsersUpdatesDocument, {
		alias: 'activeUsersUpdates',
		...operationOptions
	});
}

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
export type ChatMessageUpdatesProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	ChatMessageUpdatesSubscription,
	ChatMessageUpdatesSubscriptionVariables
> &
	TChildProps;
export function withChatMessageUpdates<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		ChatMessageUpdatesSubscription,
		ChatMessageUpdatesSubscriptionVariables,
		ChatMessageUpdatesProps<TChildProps>
	>
) {
	return ApolloReactHoc.withSubscription<
		TProps,
		ChatMessageUpdatesSubscription,
		ChatMessageUpdatesSubscriptionVariables,
		ChatMessageUpdatesProps<TChildProps>
	>(ChatMessageUpdatesDocument, {
		alias: 'chatMessageUpdates',
		...operationOptions
	});
}

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
export type TypingUsersUpdatesProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	TypingUsersUpdatesSubscription,
	TypingUsersUpdatesSubscriptionVariables
> &
	TChildProps;
export function withTypingUsersUpdates<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		TypingUsersUpdatesSubscription,
		TypingUsersUpdatesSubscriptionVariables,
		TypingUsersUpdatesProps<TChildProps>
	>
) {
	return ApolloReactHoc.withSubscription<
		TProps,
		TypingUsersUpdatesSubscription,
		TypingUsersUpdatesSubscriptionVariables,
		TypingUsersUpdatesProps<TChildProps>
	>(TypingUsersUpdatesDocument, {
		alias: 'typingUsersUpdates',
		...operationOptions
	});
}

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
export type UserUpdatesProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	UserUpdatesSubscription,
	UserUpdatesSubscriptionVariables
> &
	TChildProps;
export function withUserUpdates<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		UserUpdatesSubscription,
		UserUpdatesSubscriptionVariables,
		UserUpdatesProps<TChildProps>
	>
) {
	return ApolloReactHoc.withSubscription<
		TProps,
		UserUpdatesSubscription,
		UserUpdatesSubscriptionVariables,
		UserUpdatesProps<TChildProps>
	>(UserUpdatesDocument, {
		alias: 'userUpdates',
		...operationOptions
	});
}

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
