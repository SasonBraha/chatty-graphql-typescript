import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { IUser } from '../../types/interfaces';
import { Link } from 'react-router-dom';
import ApolloClient from 'apollo-client';
import { CrudEnum } from '../../types/enums';
import { useApolloClient, useSubscription } from 'react-apollo-hooks';
import { useLocalCache } from '../Shared/Hooks';
import { afterRender } from '../../utils';

const ACTIVE_USERS_SUBSCRIPTION = gql`
	subscription($chatSlug: String!) {
		subscribeToActiveUsersUpdates(chatSlug: $chatSlug) {
			displayName
			avatar
			slug
		}
	}
`;

const UPDATE_ACTIVE_USERS = gql`
	mutation($chatSlug: String!, $crudType: String!) {
		updateActiveUsers(chatSlug: $chatSlug, crudType: $crudType)
	}
`;

interface IProps {}

const updateActiveUsers = (
	crudType: string,
	chatSlug: string,
	client: ApolloClient<any>
) => {
	client!.mutate({
		variables: {
			chatSlug,
			crudType
		},
		mutation: UPDATE_ACTIVE_USERS
	});
};

const ActiveUsers: React.FC<IProps> = props => {
	const {
		chat: { chatSlug }
	} = useLocalCache(`
		chat {
			chatSlug 
		}
	`);
	const [previousSlug, setPreviousSlug] = useState(chatSlug);
	const client = useApolloClient();
	const { data = { subscribeToActiveUsersUpdates: [] } } = useSubscription(
		ACTIVE_USERS_SUBSCRIPTION,
		{
			variables: { chatSlug }
		}
	);

	useEffect(() => {
		updateActiveUsers(CrudEnum.DELETE, previousSlug, client);
		afterRender(() => {
			updateActiveUsers(CrudEnum.UPDATE, chatSlug, client);
		});
		setPreviousSlug(chatSlug);

		return () => updateActiveUsers(CrudEnum.DELETE, chatSlug, client);
	}, [chatSlug]);

	return (
		<ScActiveUsers>
			{data.subscribeToActiveUsersUpdates.map((user: IUser, i: number) => (
				<Link to={`/user/${user.slug}`} key={i}>
					<ScActiveUser>
						<ScAvatar src={user.avatar} alt={user.displayName} />
					</ScActiveUser>
				</Link>
			))}
		</ScActiveUsers>
	);
};

const ScActiveUsers = styled.div`
	text-align: center;
	background: ${props => props.theme.activeUsersBackground};
	padding: 0.5rem;
	overflow-y: auto;
	overflow-x: hidden;
	transition: 0.25s;
	color: white;
	grid-column: 2 / 3;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ScActiveUser = styled.div`
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 0.6rem;

	&:after {
		content: '';
		position: absolute;
		display: block;
		bottom: 0;
		right: 0.1rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: ${props => props.theme.success};
	}
`;

const ScAvatar = styled.img`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	transform: translateY(0.2rem);
`;

export default ActiveUsers;
