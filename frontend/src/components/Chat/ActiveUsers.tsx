import React, { Component, useEffect } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { IChatProps } from './Chat';
import Subscription from 'react-apollo/Subscriptions';
import { IUser } from '../../types/interfaces';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { connect } from 'react-redux';
import { IReducerState } from '../../redux/reducers';
import { CrudEnum } from '../../types/enums';

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

interface IProps extends IChatProps {
	client?: ApolloClient<any>;
	currentUser: IUser | null;
}

@connect(({ currentUser }: IReducerState) => ({ currentUser }))
class ActiveUsers extends Component<IProps> {
	componentDidMount() {
		this.addActiveUser();
	}

	componentDidUpdate(prevProps: Readonly<IProps>) {
		if (prevProps.match.params.chatSlug !== this.props.match.params.chatSlug) {
			this.removeActiveUser(prevProps.match.params.chatSlug);
			this.addActiveUser();
		}
	}

	componentWillUnmount() {
		this.removeActiveUser();
	}

	private addActiveUser = () => {
		this.props.client!.mutate({
			variables: {
				chatSlug: this.props.match.params.chatSlug,
				crudType: CrudEnum.UPDATE
			},
			mutation: UPDATE_ACTIVE_USERS
		});
	};

	private removeActiveUser = (chatSlug?: string) => {
		this.props.client!.mutate({
			variables: {
				chatSlug:
					typeof chatSlug === 'string'
						? chatSlug
						: this.props.match.params.chatSlug,
				crudType: CrudEnum.DELETE
			},
			mutation: UPDATE_ACTIVE_USERS
		});
		return null;
	};

	render() {
		return (
			<ScActiveUsers>
				<Subscription
					subscription={ACTIVE_USERS_SUBSCRIPTION}
					variables={{ chatSlug: this.props.match.params.chatSlug }}
				>
					{({ data = { subscribeToActiveUsersUpdates: [] }, loading }) => {
						return data.subscribeToActiveUsersUpdates.map(
							(user: IUser, i: number) => (
								<Link to={`/user/${user.slug}`} key={i}>
									<ScActiveUser>
										<ScAvatar src={user.avatar} alt={user.displayName} />
									</ScActiveUser>
								</Link>
							)
						);
					}}
				</Subscription>
			</ScActiveUsers>
		);
	}
}

const ScActiveUsers = styled.div`
	padding: 0 2rem 0 2rem;
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

// @ts-ignore
export default withApollo(ActiveUsers);
