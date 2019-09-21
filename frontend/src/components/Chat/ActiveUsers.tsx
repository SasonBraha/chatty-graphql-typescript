import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { IUser } from '../../types/interfaces';
import { Link } from 'react-router-dom';
import ApolloClient from 'apollo-client';
import { CrudEnum } from '../../types/enums';
import { useApolloClient, useSubscription } from '@apollo/react-hooks';
import { useLocalCache } from '../Shared/Hooks';
import { afterRender } from '../../utils';
import { useActiveUsersUpdatesSubscription } from '../../__generated__/graphql';

const UPDATE_ACTIVE_USERS = gql`
	mutation UpdateActiveUsers($chatSlug: String!, $crudType: String!) {
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
	const {
		data = { onActiveUsersUpdate: [] }
	} = useActiveUsersUpdatesSubscription({
		variables: { chatSlug }
	});

	useEffect(() => {
		updateActiveUsers(CrudEnum.DELETE, previousSlug, client);
		afterRender(() => {
			updateActiveUsers(CrudEnum.UPDATE, chatSlug, client);
		});
		setPreviousSlug(chatSlug);

		return () => updateActiveUsers(CrudEnum.DELETE, chatSlug, client);
	}, [chatSlug]);

	return (
		<S.ActiveUsers>
			{data.onActiveUsersUpdate.map((user: IUser, i: number) => (
				<Link to={`/user/${user.slug}`} key={i}>
					<S.ActiveUser>
						<S.Avatar src={user.avatar} alt={user.displayName} />
					</S.ActiveUser>
				</Link>
			))}
		</S.ActiveUsers>
	);
};

const S: any = {};
S.ActiveUsers = styled.div`
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

S.ActiveUser = styled.div`
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

S.Avatar = styled.img`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	transform: translateY(0.2rem);
`;

export default ActiveUsers;
