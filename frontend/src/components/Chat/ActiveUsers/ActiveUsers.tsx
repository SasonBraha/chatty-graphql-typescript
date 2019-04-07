import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { IChatProps } from '../Chat';
import Subscription from 'react-apollo/Subscriptions';
import { IUser } from '../../../models';
import { Link } from 'react-router-dom';

const ACTIVE_USERS_SUBSCRIPTION = gql`
	subscription($chatSlug: String!) {
		userJoined(chatSlug: $chatSlug) {
			displayName
			avatar
			slug
		}
	}
`;

const ActiveUsers = (props: IChatProps) => (
	<ScActiveUsers>
		<Subscription
			subscription={ACTIVE_USERS_SUBSCRIPTION}
			variables={{ chatSlug: props.match.params.chatSlug }}
		>
			{({ data, loading }) =>
				!loading &&
				data.userJoined.map((user: IUser, i: number) => (
					<Link to={`/users/${user.slug}`} key={i}>
						<ScActiveUser>
							<ScAvatar src={user.avatar} alt={user.displayName} />
						</ScActiveUser>
					</Link>
				))
			}
		</Subscription>
	</ScActiveUsers>
);

const ScActiveUsers = styled.div`
	padding: 0 2rem 0 2rem;
	text-align: center;
	height: 100%;
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
		bottom: 0.3rem;
		right: 0.3rem;
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
