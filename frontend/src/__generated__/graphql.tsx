import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
// Generated in 2019-10-13T09:50:09+03:00

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
	typingUsers: Array<Scalars['String']>;
};

export type ChatMessagesArgs = {
	before?: Maybe<Scalars['String']>;
	after?: Maybe<Scalars['String']>;
	last?: Maybe<Scalars['Int']>;
	first?: Maybe<Scalars['Int']>;
};

export type ChatUpdates =
	| NewMessageOutput
	| MessageDeletedOutput
	| MessageEditedOutput
	| FileUploadedOutput;

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

export type FileUploadedOutput = {
	__typename?: 'FileUploadedOutput';
	messageId: Scalars['ID'];
	file: File;
	updateType: Scalars['String'];
};

export type GenericModal = {
	__typename?: 'GenericModal';
	type?: Maybe<Scalars['String']>;
	show?: Maybe<Scalars['Boolean']>;
	text?: Maybe<Scalars['String']>;
};

export type GenericModalInput = {
	type?: Maybe<Scalars['String']>;
	show?: Maybe<Scalars['Boolean']>;
	text?: Maybe<Scalars['String']>;
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

export type MentionSuggester = {
	__typename?: 'MentionSuggester';
	show?: Maybe<Scalars['Boolean']>;
	userList: Array<User>;
};

export type MentionSuggesterInput = {
	show?: Maybe<Scalars['Boolean']>;
	userList: Array<UserInput>;
};

export type Message = {
	__typename?: 'Message';
	_id: Scalars['ID'];
	text: Scalars['String'];
	chatSlug: Scalars['String'];
	file?: Maybe<File>;
	createdBy: CreatedBy;
	userMentions?: Maybe<Array<Mention>>;
	creationToken?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['DateTime']>;
};

export type MessageConnection = {
	__typename?: 'MessageConnection';
	edges: Array<MessageEdge>;
	pageInfo?: Maybe<PageInfo>;
};

export type MessageDeletedOutput = {
	__typename?: 'MessageDeletedOutput';
	messageId: Scalars['ID'];
	updateType: Scalars['String'];
};

export type MessageEdge = {
	__typename?: 'MessageEdge';
	cursor: Scalars['String'];
	node: Message;
};

export type MessageEditedOutput = {
	__typename?: 'MessageEditedOutput';
	messageId: Scalars['ID'];
	updatedText: Scalars['String'];
	updateType: Scalars['String'];
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
	updateCurrentUser?: Maybe<Scalars['Boolean']>;
	setNotificationsData?: Maybe<Scalars['Boolean']>;
	toggleNavState?: Maybe<Scalars['Boolean']>;
	setAuthModal?: Maybe<Scalars['Boolean']>;
	setGenericModal?: Maybe<Scalars['Boolean']>;
	setCurrentChatSlug?: Maybe<Scalars['Boolean']>;
	setMentionSuggester?: Maybe<Scalars['Boolean']>;
	setTypingUsers?: Maybe<Scalars['Boolean']>;
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

export type MutationToggleNavStateArgs = {
	isOpen?: Maybe<Scalars['Boolean']>;
};

export type MutationSetAuthModalArgs = {
	isOpen?: Maybe<Scalars['Boolean']>;
};

export type MutationSetGenericModalArgs = {
	data?: Maybe<GenericModalInput>;
};

export type MutationSetCurrentChatSlugArgs = {
	slug?: Maybe<Scalars['String']>;
};

export type MutationSetMentionSuggesterArgs = {
	data?: Maybe<MentionSuggesterInput>;
};

export type MutationSetTypingUsersArgs = {
	chatSlug: Scalars['String'];
	displayName: Scalars['String'];
	crudType: Scalars['String'];
};

export type NewMessageOutput = {
	__typename?: 'NewMessageOutput';
	message: MessageEdge;
	updateType: Scalars['String'];
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
	roomsList: Array<Chat>;
	validateResetPasswordToken: Scalars['Boolean'];
	me: User;
	user?: Maybe<User>;
	users: SearchUsersOutput;
	notifications: Array<Notification>;
	currentUser?: Maybe<User>;
	notificationsData?: Maybe<NotificationsData>;
	isNavOpen?: Maybe<Scalars['Boolean']>;
	isAuthModalOpen?: Maybe<Scalars['Boolean']>;
	genericModal?: Maybe<GenericModal>;
	currentChatSlug?: Maybe<Scalars['String']>;
	mentionSuggester?: Maybe<MentionSuggester>;
};

export type QueryChatArgs = {
	chatSlug: Scalars['String'];
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
};

export type Subscription = {
	__typename?: 'Subscription';
	onActiveUsersUpdate?: Maybe<Array<User>>;
	onMessageUpdate: ChatUpdates;
	onTypingUsersUpdate?: Maybe<UserTypingOutput>;
	userUpdates: Scalars['String'];
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
	email?: Maybe<Scalars['String']>;
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

export type _SetAuthModalMutationVariables = {
	isOpen?: Maybe<Scalars['Boolean']>;
};

export type _SetAuthModalMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'setAuthModal'
>;

export type _SetNotificationsDataMutationVariables = {
	data?: Maybe<NotificationsDataInput>;
};

export type _SetNotificationsDataMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'setNotificationsData'
>;

export type _ToggleNavStateMutationVariables = {
	isOpen?: Maybe<Scalars['Boolean']>;
};

export type _ToggleNavStateMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'toggleNavState'
>;

export type _UpdateCurrentUserMutationVariables = {
	user?: Maybe<UserInput>;
};

export type _UpdateCurrentUserMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'updateCurrentUser'
>;

export type _SetGenericModalMutationVariables = {
	data?: Maybe<GenericModalInput>;
};

export type _SetGenericModalMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'setGenericModal'
>;

export type _SetMentionSuggesterMutationVariables = {
	data?: Maybe<MentionSuggesterInput>;
};

export type _SetMentionSuggesterMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'setMentionSuggester'
>;

export type _SetCurrentChatSlugMutationVariables = {
	slug?: Maybe<Scalars['String']>;
};

export type _SetCurrentChatSlugMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'setCurrentChatSlug'
>;

export type _SetTypingUsersMutationVariables = {
	chatSlug: Scalars['String'];
	displayName: Scalars['String'];
	crudType: Scalars['String'];
};

export type _SetTypingUsersMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'setTypingUsers'
>;

export type _GetAuthModalStateQueryVariables = {};

export type _GetAuthModalStateQuery = { __typename?: 'Query' } & Pick<
	Query,
	'isAuthModalOpen'
>;

export type _GetCurrentUserQueryVariables = {};

export type _GetCurrentUserQuery = { __typename?: 'Query' } & {
	currentUser: Maybe<{ __typename?: 'User' } & UserAttributesFragment>;
};

export type _GetNavStateQueryVariables = {};

export type _GetNavStateQuery = { __typename?: 'Query' } & Pick<
	Query,
	'isNavOpen'
>;

export type _GetNotificationsDataQueryVariables = {};

export type _GetNotificationsDataQuery = { __typename?: 'Query' } & {
	notificationsData: Maybe<
		{ __typename?: 'NotificationsData' } & Pick<
			NotificationsData,
			'unreadCount'
		>
	>;
};

export type _GetGenericModalQueryVariables = {};

export type _GetGenericModalQuery = { __typename?: 'Query' } & {
	genericModal: Maybe<
		{ __typename?: 'GenericModal' } & Pick<
			GenericModal,
			'show' | 'text' | 'type'
		>
	>;
};

export type _GetCurrentChatSlugQueryVariables = {};

export type _GetCurrentChatSlugQuery = { __typename?: 'Query' } & Pick<
	Query,
	'currentChatSlug'
>;

export type _GetMentionSuggesterQueryVariables = {};

export type _GetMentionSuggesterQuery = { __typename?: 'Query' } & {
	mentionSuggester: Maybe<
		{ __typename?: 'MentionSuggester' } & Pick<MentionSuggester, 'show'> & {
				userList: Array<
					{ __typename?: 'User' } & Pick<
						User,
						'displayName' | 'avatar' | 'slug'
					>
				>;
			}
	>;
};

export type _GetTypingUsersQueryVariables = {
	chatSlug: Scalars['String'];
};

export type _GetTypingUsersQuery = { __typename?: 'Query' } & {
	chat: { __typename?: 'Chat' } & Pick<Chat, 'typingUsers'>;
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
				pageInfo: Maybe<
					{ __typename?: 'PageInfo' } & Pick<
						PageInfo,
						'hasNextPage' | 'hasPreviousPage'
					>
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
	users: { __typename?: 'SearchUsersOutput' } & {
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

export type ChatRoomUpdatesSubscriptionVariables = {
	chatSlug: Scalars['String'];
};

export type ChatRoomUpdatesSubscription = { __typename?: 'Subscription' } & {
	onMessageUpdate:
		| ({ __typename?: 'NewMessageOutput' } & Pick<
				NewMessageOutput,
				'updateType'
		  > & {
					message: { __typename?: 'MessageEdge' } & Pick<
						MessageEdge,
						'cursor'
					> & { node: { __typename?: 'Message' } & MessageAttributesFragment };
				})
		| ({ __typename?: 'MessageDeletedOutput' } & Pick<
				MessageDeletedOutput,
				'messageId' | 'updateType'
		  >)
		| ({ __typename?: 'MessageEditedOutput' } & Pick<
				MessageEditedOutput,
				'messageId' | 'updateType' | 'updatedText'
		  >)
		| ({ __typename?: 'FileUploadedOutput' } & Pick<
				FileUploadedOutput,
				'updateType' | 'messageId'
		  > & {
					file: { __typename?: 'File' } & Pick<File, 'path'> & {
							dimensions: { __typename?: 'FileDimensions' } & Pick<
								FileDimensions,
								'height' | 'width'
							>;
						};
				});
};

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
export const _SetAuthModalDocument = gql`
	mutation _SetAuthModal($isOpen: Boolean) {
		setAuthModal(isOpen: $isOpen) @client
	}
`;
export type _SetAuthModalMutationFn = ApolloReactCommon.MutationFunction<
	_SetAuthModalMutation,
	_SetAuthModalMutationVariables
>;
export type _SetAuthModalProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
	_SetAuthModalMutation,
	_SetAuthModalMutationVariables
> &
	TChildProps;
export function with_SetAuthModal<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_SetAuthModalMutation,
		_SetAuthModalMutationVariables,
		_SetAuthModalProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_SetAuthModalMutation,
		_SetAuthModalMutationVariables,
		_SetAuthModalProps<TChildProps>
	>(_SetAuthModalDocument, {
		alias: 'setAuthModal',
		...operationOptions
	});
}

/**
 * __use_SetAuthModalMutation__
 *
 * To run a mutation, you first call `use_SetAuthModalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_SetAuthModalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAuthModalMutation, { data, loading, error }] = use_SetAuthModalMutation({
 *   variables: {
 *      isOpen: // value for 'isOpen'
 *   },
 * });
 */
export function use_SetAuthModalMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_SetAuthModalMutation,
		_SetAuthModalMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_SetAuthModalMutation,
		_SetAuthModalMutationVariables
	>(_SetAuthModalDocument, baseOptions);
}
export type _SetAuthModalMutationHookResult = ReturnType<
	typeof use_SetAuthModalMutation
>;
export type _SetAuthModalMutationResult = ApolloReactCommon.MutationResult<
	_SetAuthModalMutation
>;
export type _SetAuthModalMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_SetAuthModalMutation,
	_SetAuthModalMutationVariables
>;
export const _SetNotificationsDataDocument = gql`
	mutation _SetNotificationsData($data: NotificationsDataInput) {
		setNotificationsData(data: $data) @client
	}
`;
export type _SetNotificationsDataMutationFn = ApolloReactCommon.MutationFunction<
	_SetNotificationsDataMutation,
	_SetNotificationsDataMutationVariables
>;
export type _SetNotificationsDataProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	_SetNotificationsDataMutation,
	_SetNotificationsDataMutationVariables
> &
	TChildProps;
export function with_SetNotificationsData<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_SetNotificationsDataMutation,
		_SetNotificationsDataMutationVariables,
		_SetNotificationsDataProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_SetNotificationsDataMutation,
		_SetNotificationsDataMutationVariables,
		_SetNotificationsDataProps<TChildProps>
	>(_SetNotificationsDataDocument, {
		alias: 'setNotificationsData',
		...operationOptions
	});
}

/**
 * __use_SetNotificationsDataMutation__
 *
 * To run a mutation, you first call `use_SetNotificationsDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_SetNotificationsDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNotificationsDataMutation, { data, loading, error }] = use_SetNotificationsDataMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function use_SetNotificationsDataMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_SetNotificationsDataMutation,
		_SetNotificationsDataMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_SetNotificationsDataMutation,
		_SetNotificationsDataMutationVariables
	>(_SetNotificationsDataDocument, baseOptions);
}
export type _SetNotificationsDataMutationHookResult = ReturnType<
	typeof use_SetNotificationsDataMutation
>;
export type _SetNotificationsDataMutationResult = ApolloReactCommon.MutationResult<
	_SetNotificationsDataMutation
>;
export type _SetNotificationsDataMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_SetNotificationsDataMutation,
	_SetNotificationsDataMutationVariables
>;
export const _ToggleNavStateDocument = gql`
	mutation _ToggleNavState($isOpen: Boolean) {
		toggleNavState(isOpen: $isOpen) @client
	}
`;
export type _ToggleNavStateMutationFn = ApolloReactCommon.MutationFunction<
	_ToggleNavStateMutation,
	_ToggleNavStateMutationVariables
>;
export type _ToggleNavStateProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
	_ToggleNavStateMutation,
	_ToggleNavStateMutationVariables
> &
	TChildProps;
export function with_ToggleNavState<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_ToggleNavStateMutation,
		_ToggleNavStateMutationVariables,
		_ToggleNavStateProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_ToggleNavStateMutation,
		_ToggleNavStateMutationVariables,
		_ToggleNavStateProps<TChildProps>
	>(_ToggleNavStateDocument, {
		alias: 'toggleNavState',
		...operationOptions
	});
}

/**
 * __use_ToggleNavStateMutation__
 *
 * To run a mutation, you first call `use_ToggleNavStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_ToggleNavStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleNavStateMutation, { data, loading, error }] = use_ToggleNavStateMutation({
 *   variables: {
 *      isOpen: // value for 'isOpen'
 *   },
 * });
 */
export function use_ToggleNavStateMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_ToggleNavStateMutation,
		_ToggleNavStateMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_ToggleNavStateMutation,
		_ToggleNavStateMutationVariables
	>(_ToggleNavStateDocument, baseOptions);
}
export type _ToggleNavStateMutationHookResult = ReturnType<
	typeof use_ToggleNavStateMutation
>;
export type _ToggleNavStateMutationResult = ApolloReactCommon.MutationResult<
	_ToggleNavStateMutation
>;
export type _ToggleNavStateMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_ToggleNavStateMutation,
	_ToggleNavStateMutationVariables
>;
export const _UpdateCurrentUserDocument = gql`
	mutation _UpdateCurrentUser($user: UserInput) {
		updateCurrentUser(user: $user) @client
	}
`;
export type _UpdateCurrentUserMutationFn = ApolloReactCommon.MutationFunction<
	_UpdateCurrentUserMutation,
	_UpdateCurrentUserMutationVariables
>;
export type _UpdateCurrentUserProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	_UpdateCurrentUserMutation,
	_UpdateCurrentUserMutationVariables
> &
	TChildProps;
export function with_UpdateCurrentUser<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_UpdateCurrentUserMutation,
		_UpdateCurrentUserMutationVariables,
		_UpdateCurrentUserProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_UpdateCurrentUserMutation,
		_UpdateCurrentUserMutationVariables,
		_UpdateCurrentUserProps<TChildProps>
	>(_UpdateCurrentUserDocument, {
		alias: 'updateCurrentUser',
		...operationOptions
	});
}

/**
 * __use_UpdateCurrentUserMutation__
 *
 * To run a mutation, you first call `use_UpdateCurrentUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_UpdateCurrentUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCurrentUserMutation, { data, loading, error }] = use_UpdateCurrentUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function use_UpdateCurrentUserMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_UpdateCurrentUserMutation,
		_UpdateCurrentUserMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_UpdateCurrentUserMutation,
		_UpdateCurrentUserMutationVariables
	>(_UpdateCurrentUserDocument, baseOptions);
}
export type _UpdateCurrentUserMutationHookResult = ReturnType<
	typeof use_UpdateCurrentUserMutation
>;
export type _UpdateCurrentUserMutationResult = ApolloReactCommon.MutationResult<
	_UpdateCurrentUserMutation
>;
export type _UpdateCurrentUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_UpdateCurrentUserMutation,
	_UpdateCurrentUserMutationVariables
>;
export const _SetGenericModalDocument = gql`
	mutation _SetGenericModal($data: GenericModalInput) {
		setGenericModal(data: $data) @client
	}
`;
export type _SetGenericModalMutationFn = ApolloReactCommon.MutationFunction<
	_SetGenericModalMutation,
	_SetGenericModalMutationVariables
>;
export type _SetGenericModalProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	_SetGenericModalMutation,
	_SetGenericModalMutationVariables
> &
	TChildProps;
export function with_SetGenericModal<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_SetGenericModalMutation,
		_SetGenericModalMutationVariables,
		_SetGenericModalProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_SetGenericModalMutation,
		_SetGenericModalMutationVariables,
		_SetGenericModalProps<TChildProps>
	>(_SetGenericModalDocument, {
		alias: 'setGenericModal',
		...operationOptions
	});
}

/**
 * __use_SetGenericModalMutation__
 *
 * To run a mutation, you first call `use_SetGenericModalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_SetGenericModalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setGenericModalMutation, { data, loading, error }] = use_SetGenericModalMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function use_SetGenericModalMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_SetGenericModalMutation,
		_SetGenericModalMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_SetGenericModalMutation,
		_SetGenericModalMutationVariables
	>(_SetGenericModalDocument, baseOptions);
}
export type _SetGenericModalMutationHookResult = ReturnType<
	typeof use_SetGenericModalMutation
>;
export type _SetGenericModalMutationResult = ApolloReactCommon.MutationResult<
	_SetGenericModalMutation
>;
export type _SetGenericModalMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_SetGenericModalMutation,
	_SetGenericModalMutationVariables
>;
export const _SetMentionSuggesterDocument = gql`
	mutation _SetMentionSuggester($data: MentionSuggesterInput) {
		setMentionSuggester(data: $data) @client
	}
`;
export type _SetMentionSuggesterMutationFn = ApolloReactCommon.MutationFunction<
	_SetMentionSuggesterMutation,
	_SetMentionSuggesterMutationVariables
>;
export type _SetMentionSuggesterProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	_SetMentionSuggesterMutation,
	_SetMentionSuggesterMutationVariables
> &
	TChildProps;
export function with_SetMentionSuggester<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_SetMentionSuggesterMutation,
		_SetMentionSuggesterMutationVariables,
		_SetMentionSuggesterProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_SetMentionSuggesterMutation,
		_SetMentionSuggesterMutationVariables,
		_SetMentionSuggesterProps<TChildProps>
	>(_SetMentionSuggesterDocument, {
		alias: 'setMentionSuggester',
		...operationOptions
	});
}

/**
 * __use_SetMentionSuggesterMutation__
 *
 * To run a mutation, you first call `use_SetMentionSuggesterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_SetMentionSuggesterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMentionSuggesterMutation, { data, loading, error }] = use_SetMentionSuggesterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function use_SetMentionSuggesterMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_SetMentionSuggesterMutation,
		_SetMentionSuggesterMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_SetMentionSuggesterMutation,
		_SetMentionSuggesterMutationVariables
	>(_SetMentionSuggesterDocument, baseOptions);
}
export type _SetMentionSuggesterMutationHookResult = ReturnType<
	typeof use_SetMentionSuggesterMutation
>;
export type _SetMentionSuggesterMutationResult = ApolloReactCommon.MutationResult<
	_SetMentionSuggesterMutation
>;
export type _SetMentionSuggesterMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_SetMentionSuggesterMutation,
	_SetMentionSuggesterMutationVariables
>;
export const _SetCurrentChatSlugDocument = gql`
	mutation _SetCurrentChatSlug($slug: String) {
		setCurrentChatSlug(slug: $slug) @client
	}
`;
export type _SetCurrentChatSlugMutationFn = ApolloReactCommon.MutationFunction<
	_SetCurrentChatSlugMutation,
	_SetCurrentChatSlugMutationVariables
>;
export type _SetCurrentChatSlugProps<
	TChildProps = {}
> = ApolloReactHoc.MutateProps<
	_SetCurrentChatSlugMutation,
	_SetCurrentChatSlugMutationVariables
> &
	TChildProps;
export function with_SetCurrentChatSlug<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_SetCurrentChatSlugMutation,
		_SetCurrentChatSlugMutationVariables,
		_SetCurrentChatSlugProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_SetCurrentChatSlugMutation,
		_SetCurrentChatSlugMutationVariables,
		_SetCurrentChatSlugProps<TChildProps>
	>(_SetCurrentChatSlugDocument, {
		alias: 'setCurrentChatSlug',
		...operationOptions
	});
}

/**
 * __use_SetCurrentChatSlugMutation__
 *
 * To run a mutation, you first call `use_SetCurrentChatSlugMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_SetCurrentChatSlugMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCurrentChatSlugMutation, { data, loading, error }] = use_SetCurrentChatSlugMutation({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function use_SetCurrentChatSlugMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_SetCurrentChatSlugMutation,
		_SetCurrentChatSlugMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_SetCurrentChatSlugMutation,
		_SetCurrentChatSlugMutationVariables
	>(_SetCurrentChatSlugDocument, baseOptions);
}
export type _SetCurrentChatSlugMutationHookResult = ReturnType<
	typeof use_SetCurrentChatSlugMutation
>;
export type _SetCurrentChatSlugMutationResult = ApolloReactCommon.MutationResult<
	_SetCurrentChatSlugMutation
>;
export type _SetCurrentChatSlugMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_SetCurrentChatSlugMutation,
	_SetCurrentChatSlugMutationVariables
>;
export const _SetTypingUsersDocument = gql`
	mutation _SetTypingUsers(
		$chatSlug: String!
		$displayName: String!
		$crudType: String!
	) {
		setTypingUsers(
			chatSlug: $chatSlug
			displayName: $displayName
			crudType: $crudType
		) @client
	}
`;
export type _SetTypingUsersMutationFn = ApolloReactCommon.MutationFunction<
	_SetTypingUsersMutation,
	_SetTypingUsersMutationVariables
>;
export type _SetTypingUsersProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
	_SetTypingUsersMutation,
	_SetTypingUsersMutationVariables
> &
	TChildProps;
export function with_SetTypingUsers<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_SetTypingUsersMutation,
		_SetTypingUsersMutationVariables,
		_SetTypingUsersProps<TChildProps>
	>
) {
	return ApolloReactHoc.withMutation<
		TProps,
		_SetTypingUsersMutation,
		_SetTypingUsersMutationVariables,
		_SetTypingUsersProps<TChildProps>
	>(_SetTypingUsersDocument, {
		alias: 'setTypingUsers',
		...operationOptions
	});
}

/**
 * __use_SetTypingUsersMutation__
 *
 * To run a mutation, you first call `use_SetTypingUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `use_SetTypingUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTypingUsersMutation, { data, loading, error }] = use_SetTypingUsersMutation({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *      displayName: // value for 'displayName'
 *      crudType: // value for 'crudType'
 *   },
 * });
 */
export function use_SetTypingUsersMutation(
	baseOptions?: ApolloReactHooks.MutationHookOptions<
		_SetTypingUsersMutation,
		_SetTypingUsersMutationVariables
	>
) {
	return ApolloReactHooks.useMutation<
		_SetTypingUsersMutation,
		_SetTypingUsersMutationVariables
	>(_SetTypingUsersDocument, baseOptions);
}
export type _SetTypingUsersMutationHookResult = ReturnType<
	typeof use_SetTypingUsersMutation
>;
export type _SetTypingUsersMutationResult = ApolloReactCommon.MutationResult<
	_SetTypingUsersMutation
>;
export type _SetTypingUsersMutationOptions = ApolloReactCommon.BaseMutationOptions<
	_SetTypingUsersMutation,
	_SetTypingUsersMutationVariables
>;
export const _GetAuthModalStateDocument = gql`
	query _GetAuthModalState {
		isAuthModalOpen @client
	}
`;
export type _GetAuthModalStateProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	_GetAuthModalStateQuery,
	_GetAuthModalStateQueryVariables
> &
	TChildProps;
export function with_GetAuthModalState<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetAuthModalStateQuery,
		_GetAuthModalStateQueryVariables,
		_GetAuthModalStateProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetAuthModalStateQuery,
		_GetAuthModalStateQueryVariables,
		_GetAuthModalStateProps<TChildProps>
	>(_GetAuthModalStateDocument, {
		alias: 'getAuthModalState',
		...operationOptions
	});
}

/**
 * __use_GetAuthModalStateQuery__
 *
 * To run a query within a React component, call `use_GetAuthModalStateQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetAuthModalStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetAuthModalStateQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetAuthModalStateQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetAuthModalStateQuery,
		_GetAuthModalStateQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetAuthModalStateQuery,
		_GetAuthModalStateQueryVariables
	>(_GetAuthModalStateDocument, baseOptions);
}
export function use_GetAuthModalStateLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetAuthModalStateQuery,
		_GetAuthModalStateQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetAuthModalStateQuery,
		_GetAuthModalStateQueryVariables
	>(_GetAuthModalStateDocument, baseOptions);
}
export type _GetAuthModalStateQueryHookResult = ReturnType<
	typeof use_GetAuthModalStateQuery
>;
export type _GetAuthModalStateLazyQueryHookResult = ReturnType<
	typeof use_GetAuthModalStateLazyQuery
>;
export type _GetAuthModalStateQueryResult = ApolloReactCommon.QueryResult<
	_GetAuthModalStateQuery,
	_GetAuthModalStateQueryVariables
>;
export const _GetCurrentUserDocument = gql`
	query _GetCurrentUser {
		currentUser @client {
			...userAttributes
		}
	}
	${UserAttributesFragmentDoc}
`;
export type _GetCurrentUserProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	_GetCurrentUserQuery,
	_GetCurrentUserQueryVariables
> &
	TChildProps;
export function with_GetCurrentUser<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetCurrentUserQuery,
		_GetCurrentUserQueryVariables,
		_GetCurrentUserProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetCurrentUserQuery,
		_GetCurrentUserQueryVariables,
		_GetCurrentUserProps<TChildProps>
	>(_GetCurrentUserDocument, {
		alias: 'getCurrentUser',
		...operationOptions
	});
}

/**
 * __use_GetCurrentUserQuery__
 *
 * To run a query within a React component, call `use_GetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetCurrentUserQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetCurrentUserQuery,
		_GetCurrentUserQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetCurrentUserQuery,
		_GetCurrentUserQueryVariables
	>(_GetCurrentUserDocument, baseOptions);
}
export function use_GetCurrentUserLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetCurrentUserQuery,
		_GetCurrentUserQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetCurrentUserQuery,
		_GetCurrentUserQueryVariables
	>(_GetCurrentUserDocument, baseOptions);
}
export type _GetCurrentUserQueryHookResult = ReturnType<
	typeof use_GetCurrentUserQuery
>;
export type _GetCurrentUserLazyQueryHookResult = ReturnType<
	typeof use_GetCurrentUserLazyQuery
>;
export type _GetCurrentUserQueryResult = ApolloReactCommon.QueryResult<
	_GetCurrentUserQuery,
	_GetCurrentUserQueryVariables
>;
export const _GetNavStateDocument = gql`
	query _GetNavState {
		isNavOpen @client
	}
`;
export type _GetNavStateProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	_GetNavStateQuery,
	_GetNavStateQueryVariables
> &
	TChildProps;
export function with_GetNavState<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetNavStateQuery,
		_GetNavStateQueryVariables,
		_GetNavStateProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetNavStateQuery,
		_GetNavStateQueryVariables,
		_GetNavStateProps<TChildProps>
	>(_GetNavStateDocument, {
		alias: 'getNavState',
		...operationOptions
	});
}

/**
 * __use_GetNavStateQuery__
 *
 * To run a query within a React component, call `use_GetNavStateQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetNavStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetNavStateQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetNavStateQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetNavStateQuery,
		_GetNavStateQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetNavStateQuery,
		_GetNavStateQueryVariables
	>(_GetNavStateDocument, baseOptions);
}
export function use_GetNavStateLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetNavStateQuery,
		_GetNavStateQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetNavStateQuery,
		_GetNavStateQueryVariables
	>(_GetNavStateDocument, baseOptions);
}
export type _GetNavStateQueryHookResult = ReturnType<
	typeof use_GetNavStateQuery
>;
export type _GetNavStateLazyQueryHookResult = ReturnType<
	typeof use_GetNavStateLazyQuery
>;
export type _GetNavStateQueryResult = ApolloReactCommon.QueryResult<
	_GetNavStateQuery,
	_GetNavStateQueryVariables
>;
export const _GetNotificationsDataDocument = gql`
	query _GetNotificationsData {
		notificationsData @client {
			unreadCount
		}
	}
`;
export type _GetNotificationsDataProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	_GetNotificationsDataQuery,
	_GetNotificationsDataQueryVariables
> &
	TChildProps;
export function with_GetNotificationsData<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetNotificationsDataQuery,
		_GetNotificationsDataQueryVariables,
		_GetNotificationsDataProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetNotificationsDataQuery,
		_GetNotificationsDataQueryVariables,
		_GetNotificationsDataProps<TChildProps>
	>(_GetNotificationsDataDocument, {
		alias: 'getNotificationsData',
		...operationOptions
	});
}

/**
 * __use_GetNotificationsDataQuery__
 *
 * To run a query within a React component, call `use_GetNotificationsDataQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetNotificationsDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetNotificationsDataQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetNotificationsDataQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetNotificationsDataQuery,
		_GetNotificationsDataQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetNotificationsDataQuery,
		_GetNotificationsDataQueryVariables
	>(_GetNotificationsDataDocument, baseOptions);
}
export function use_GetNotificationsDataLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetNotificationsDataQuery,
		_GetNotificationsDataQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetNotificationsDataQuery,
		_GetNotificationsDataQueryVariables
	>(_GetNotificationsDataDocument, baseOptions);
}
export type _GetNotificationsDataQueryHookResult = ReturnType<
	typeof use_GetNotificationsDataQuery
>;
export type _GetNotificationsDataLazyQueryHookResult = ReturnType<
	typeof use_GetNotificationsDataLazyQuery
>;
export type _GetNotificationsDataQueryResult = ApolloReactCommon.QueryResult<
	_GetNotificationsDataQuery,
	_GetNotificationsDataQueryVariables
>;
export const _GetGenericModalDocument = gql`
	query _GetGenericModal {
		genericModal @client {
			show
			text
			type
		}
	}
`;
export type _GetGenericModalProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	_GetGenericModalQuery,
	_GetGenericModalQueryVariables
> &
	TChildProps;
export function with_GetGenericModal<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetGenericModalQuery,
		_GetGenericModalQueryVariables,
		_GetGenericModalProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetGenericModalQuery,
		_GetGenericModalQueryVariables,
		_GetGenericModalProps<TChildProps>
	>(_GetGenericModalDocument, {
		alias: 'getGenericModal',
		...operationOptions
	});
}

/**
 * __use_GetGenericModalQuery__
 *
 * To run a query within a React component, call `use_GetGenericModalQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetGenericModalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetGenericModalQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetGenericModalQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetGenericModalQuery,
		_GetGenericModalQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetGenericModalQuery,
		_GetGenericModalQueryVariables
	>(_GetGenericModalDocument, baseOptions);
}
export function use_GetGenericModalLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetGenericModalQuery,
		_GetGenericModalQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetGenericModalQuery,
		_GetGenericModalQueryVariables
	>(_GetGenericModalDocument, baseOptions);
}
export type _GetGenericModalQueryHookResult = ReturnType<
	typeof use_GetGenericModalQuery
>;
export type _GetGenericModalLazyQueryHookResult = ReturnType<
	typeof use_GetGenericModalLazyQuery
>;
export type _GetGenericModalQueryResult = ApolloReactCommon.QueryResult<
	_GetGenericModalQuery,
	_GetGenericModalQueryVariables
>;
export const _GetCurrentChatSlugDocument = gql`
	query _GetCurrentChatSlug {
		currentChatSlug @client
	}
`;
export type _GetCurrentChatSlugProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	_GetCurrentChatSlugQuery,
	_GetCurrentChatSlugQueryVariables
> &
	TChildProps;
export function with_GetCurrentChatSlug<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetCurrentChatSlugQuery,
		_GetCurrentChatSlugQueryVariables,
		_GetCurrentChatSlugProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetCurrentChatSlugQuery,
		_GetCurrentChatSlugQueryVariables,
		_GetCurrentChatSlugProps<TChildProps>
	>(_GetCurrentChatSlugDocument, {
		alias: 'getCurrentChatSlug',
		...operationOptions
	});
}

/**
 * __use_GetCurrentChatSlugQuery__
 *
 * To run a query within a React component, call `use_GetCurrentChatSlugQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetCurrentChatSlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetCurrentChatSlugQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetCurrentChatSlugQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetCurrentChatSlugQuery,
		_GetCurrentChatSlugQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetCurrentChatSlugQuery,
		_GetCurrentChatSlugQueryVariables
	>(_GetCurrentChatSlugDocument, baseOptions);
}
export function use_GetCurrentChatSlugLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetCurrentChatSlugQuery,
		_GetCurrentChatSlugQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetCurrentChatSlugQuery,
		_GetCurrentChatSlugQueryVariables
	>(_GetCurrentChatSlugDocument, baseOptions);
}
export type _GetCurrentChatSlugQueryHookResult = ReturnType<
	typeof use_GetCurrentChatSlugQuery
>;
export type _GetCurrentChatSlugLazyQueryHookResult = ReturnType<
	typeof use_GetCurrentChatSlugLazyQuery
>;
export type _GetCurrentChatSlugQueryResult = ApolloReactCommon.QueryResult<
	_GetCurrentChatSlugQuery,
	_GetCurrentChatSlugQueryVariables
>;
export const _GetMentionSuggesterDocument = gql`
	query _GetMentionSuggester {
		mentionSuggester @client {
			show
			userList {
				displayName
				avatar
				slug
			}
		}
	}
`;
export type _GetMentionSuggesterProps<
	TChildProps = {}
> = ApolloReactHoc.DataProps<
	_GetMentionSuggesterQuery,
	_GetMentionSuggesterQueryVariables
> &
	TChildProps;
export function with_GetMentionSuggester<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetMentionSuggesterQuery,
		_GetMentionSuggesterQueryVariables,
		_GetMentionSuggesterProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetMentionSuggesterQuery,
		_GetMentionSuggesterQueryVariables,
		_GetMentionSuggesterProps<TChildProps>
	>(_GetMentionSuggesterDocument, {
		alias: 'getMentionSuggester',
		...operationOptions
	});
}

/**
 * __use_GetMentionSuggesterQuery__
 *
 * To run a query within a React component, call `use_GetMentionSuggesterQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetMentionSuggesterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetMentionSuggesterQuery({
 *   variables: {
 *   },
 * });
 */
export function use_GetMentionSuggesterQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetMentionSuggesterQuery,
		_GetMentionSuggesterQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetMentionSuggesterQuery,
		_GetMentionSuggesterQueryVariables
	>(_GetMentionSuggesterDocument, baseOptions);
}
export function use_GetMentionSuggesterLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetMentionSuggesterQuery,
		_GetMentionSuggesterQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetMentionSuggesterQuery,
		_GetMentionSuggesterQueryVariables
	>(_GetMentionSuggesterDocument, baseOptions);
}
export type _GetMentionSuggesterQueryHookResult = ReturnType<
	typeof use_GetMentionSuggesterQuery
>;
export type _GetMentionSuggesterLazyQueryHookResult = ReturnType<
	typeof use_GetMentionSuggesterLazyQuery
>;
export type _GetMentionSuggesterQueryResult = ApolloReactCommon.QueryResult<
	_GetMentionSuggesterQuery,
	_GetMentionSuggesterQueryVariables
>;
export const _GetTypingUsersDocument = gql`
	query _GetTypingUsers($chatSlug: String!) {
		chat(chatSlug: $chatSlug) @client {
			typingUsers @client
		}
	}
`;
export type _GetTypingUsersProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	_GetTypingUsersQuery,
	_GetTypingUsersQueryVariables
> &
	TChildProps;
export function with_GetTypingUsers<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		_GetTypingUsersQuery,
		_GetTypingUsersQueryVariables,
		_GetTypingUsersProps<TChildProps>
	>
) {
	return ApolloReactHoc.withQuery<
		TProps,
		_GetTypingUsersQuery,
		_GetTypingUsersQueryVariables,
		_GetTypingUsersProps<TChildProps>
	>(_GetTypingUsersDocument, {
		alias: 'getTypingUsers',
		...operationOptions
	});
}

/**
 * __use_GetTypingUsersQuery__
 *
 * To run a query within a React component, call `use_GetTypingUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `use_GetTypingUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = use_GetTypingUsersQuery({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *   },
 * });
 */
export function use_GetTypingUsersQuery(
	baseOptions?: ApolloReactHooks.QueryHookOptions<
		_GetTypingUsersQuery,
		_GetTypingUsersQueryVariables
	>
) {
	return ApolloReactHooks.useQuery<
		_GetTypingUsersQuery,
		_GetTypingUsersQueryVariables
	>(_GetTypingUsersDocument, baseOptions);
}
export function use_GetTypingUsersLazyQuery(
	baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
		_GetTypingUsersQuery,
		_GetTypingUsersQueryVariables
	>
) {
	return ApolloReactHooks.useLazyQuery<
		_GetTypingUsersQuery,
		_GetTypingUsersQueryVariables
	>(_GetTypingUsersDocument, baseOptions);
}
export type _GetTypingUsersQueryHookResult = ReturnType<
	typeof use_GetTypingUsersQuery
>;
export type _GetTypingUsersLazyQueryHookResult = ReturnType<
	typeof use_GetTypingUsersLazyQuery
>;
export type _GetTypingUsersQueryResult = ApolloReactCommon.QueryResult<
	_GetTypingUsersQuery,
	_GetTypingUsersQueryVariables
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

/**
 * __usePostMessageMutation__
 *
 * To run a mutation, you first call `usePostMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postMessageMutation, { data, loading, error }] = usePostMessageMutation({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *      text: // value for 'text'
 *   },
 * });
 */
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

/**
 * __useUpdateActiveUsersMutation__
 *
 * To run a mutation, you first call `useUpdateActiveUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateActiveUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateActiveUsersMutation, { data, loading, error }] = useUpdateActiveUsersMutation({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *      crudType: // value for 'crudType'
 *   },
 * });
 */
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

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
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
export type GetMessagesLazyQueryHookResult = ReturnType<
	typeof useGetMessagesLazyQuery
>;
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

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
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
export type GetNotificationsLazyQueryHookResult = ReturnType<
	typeof useGetNotificationsLazyQuery
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

/**
 * __useGetRoomsListQuery__
 *
 * To run a query within a React component, call `useGetRoomsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomsListQuery({
 *   variables: {
 *   },
 * });
 */
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
export type GetRoomsListLazyQueryHookResult = ReturnType<
	typeof useGetRoomsListLazyQuery
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

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
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
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<
	GetUserQuery,
	GetUserQueryVariables
>;
export const GetUsersDocument = gql`
	query GetUsers($limit: Int, $displayName: String!) {
		users(displayName: $displayName, limit: $limit) {
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

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      displayName: // value for 'displayName'
 *   },
 * });
 */
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
export type GetUsersLazyQueryHookResult = ReturnType<
	typeof useGetUsersLazyQuery
>;
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

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
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
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
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

/**
 * __useUpdateMessageMutation__
 *
 * To run a mutation, you first call `useUpdateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMessageMutation, { data, loading, error }] = useUpdateMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      crudType: // value for 'crudType'
 *      messageText: // value for 'messageText'
 *      creationToken: // value for 'creationToken'
 *      chatSlug: // value for 'chatSlug'
 *   },
 * });
 */
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

/**
 * __useActiveUsersUpdatesSubscription__
 *
 * To run a query within a React component, call `useActiveUsersUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useActiveUsersUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActiveUsersUpdatesSubscription({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *   },
 * });
 */
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
export const ChatRoomUpdatesDocument = gql`
	subscription ChatRoomUpdates($chatSlug: String!) {
		onMessageUpdate(chatSlug: $chatSlug) {
			... on FileUploadedOutput {
				file {
					dimensions {
						height
						width
					}
					path
				}
				updateType
				messageId
			}
			... on MessageDeletedOutput {
				messageId
				updateType
			}
			... on NewMessageOutput {
				message {
					cursor
					node {
						...messageAttributes
					}
				}
				updateType
			}
			... on MessageEditedOutput {
				messageId
				updateType
				updatedText
			}
		}
	}
	${MessageAttributesFragmentDoc}
`;
export type ChatRoomUpdatesProps<TChildProps = {}> = ApolloReactHoc.DataProps<
	ChatRoomUpdatesSubscription,
	ChatRoomUpdatesSubscriptionVariables
> &
	TChildProps;
export function withChatRoomUpdates<TProps, TChildProps = {}>(
	operationOptions?: ApolloReactHoc.OperationOption<
		TProps,
		ChatRoomUpdatesSubscription,
		ChatRoomUpdatesSubscriptionVariables,
		ChatRoomUpdatesProps<TChildProps>
	>
) {
	return ApolloReactHoc.withSubscription<
		TProps,
		ChatRoomUpdatesSubscription,
		ChatRoomUpdatesSubscriptionVariables,
		ChatRoomUpdatesProps<TChildProps>
	>(ChatRoomUpdatesDocument, {
		alias: 'chatRoomUpdates',
		...operationOptions
	});
}

/**
 * __useChatRoomUpdatesSubscription__
 *
 * To run a query within a React component, call `useChatRoomUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatRoomUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatRoomUpdatesSubscription({
 *   variables: {
 *      chatSlug: // value for 'chatSlug'
 *   },
 * });
 */
export function useChatRoomUpdatesSubscription(
	baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
		ChatRoomUpdatesSubscription,
		ChatRoomUpdatesSubscriptionVariables
	>
) {
	return ApolloReactHooks.useSubscription<
		ChatRoomUpdatesSubscription,
		ChatRoomUpdatesSubscriptionVariables
	>(ChatRoomUpdatesDocument, baseOptions);
}
export type ChatRoomUpdatesSubscriptionHookResult = ReturnType<
	typeof useChatRoomUpdatesSubscription
>;
export type ChatRoomUpdatesSubscriptionResult = ApolloReactCommon.SubscriptionResult<
	ChatRoomUpdatesSubscription
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

/**
 * __useTypingUsersUpdatesSubscription__
 *
 * To run a query within a React component, call `useTypingUsersUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTypingUsersUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTypingUsersUpdatesSubscription({
 *   variables: {
 *   },
 * });
 */
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

/**
 * __useUserUpdatesSubscription__
 *
 * To run a query within a React component, call `useUserUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserUpdatesSubscription({
 *   variables: {
 *   },
 * });
 */
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
