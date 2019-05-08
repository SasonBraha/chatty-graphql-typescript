import React, { useState } from 'react';
import gql from 'graphql-tag';
import { IChatProps } from '../Chat';
import Subscription from 'react-apollo/Subscriptions';
import UserTyping from './UserTyping';

const TYPING_USERS_SUBSCRIPTION = gql`
	subscription($chatSlug: String!) {
		subscribeToTypingUsersUpdates(chatSlug: $chatSlug) {
			crudType
			user {
				displayName
				slug
			}
		}
	}
`;

interface IProps extends IChatProps {}

const TypingUsersData: React.FC<IProps> = props => (
	<Subscription
		subscription={TYPING_USERS_SUBSCRIPTION}
		variables={{ chatSlug: props.match.params.chatSlug }}
	>
		{({ data = { subscribeToTypingUsersUpdates: {} }, loading }) => (
			<UserTyping data={data.subscribeToTypingUsersUpdates} loading={loading} />
		)}
	</Subscription>
);

export default TypingUsersData;
