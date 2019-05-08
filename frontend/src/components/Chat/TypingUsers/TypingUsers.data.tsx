import React, { useState } from 'react';
import gql from 'graphql-tag';
import { IChatProps } from '../Chat';
import Subscription from 'react-apollo/Subscriptions';
import TypingUsers from './TypingUsers';

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

interface IProps {
	chatSlug: string;
	className?: string;
}

const TypingUsersData: React.FC<IProps> = props => (
	<Subscription
		subscription={TYPING_USERS_SUBSCRIPTION}
		variables={{ chatSlug: props.chatSlug }}
	>
		{({ data = { subscribeToTypingUsersUpdates: {} }, loading }) => {
			return (
				<TypingUsers
					data={data.subscribeToTypingUsersUpdates}
					loading={loading}
					className={props.className}
				/>
			);
		}}
	</Subscription>
);

export default TypingUsersData;
