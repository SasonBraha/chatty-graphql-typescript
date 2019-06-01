import React, { useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { setCurrentUser, setNotificationsData } from '../redux/actions';
import { IUser } from '../types/interfaces';
import Nav from './Nav';
import Container from './Container';
import { withRouter } from 'react-router-dom';
import { GenericModal } from './Shared';
import Routes from './Routes';
import { Helmet } from 'react-helmet';
import { useApolloClient, useSubscription } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const ME_DATA_QUERY = gql`
	query {
		me {
			unreadNotificationsCount
		}
	}
`;

const SUBSCRIBE_TO_USER_UPDATES = gql`
	subscription {
		userUpdates
	}
`;

interface IProps {
	setCurrentUser: typeof setCurrentUser;
	setNotificationsData: typeof setNotificationsData;
}

const App: React.FC<IProps> = props => {
	const client = useApolloClient();
	const { data } = useSubscription(SUBSCRIBE_TO_USER_UPDATES);

	useLayoutEffect(() => {
		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);
		if (accessToken) {
			props.setCurrentUser(jwtDecode<IUser>(accessToken));
		}
	}, []);

	useEffect(() => {
		client
			.query({
				query: ME_DATA_QUERY
			})
			.then(queryObject => {
				const {
					data: {
						me: { unreadNotificationsCount }
					}
				} = queryObject;
				props.setNotificationsData({
					unread: unreadNotificationsCount
				});
			});
	}, []);

	useEffect(() => {
		console.log('changed', data);
	}, [data]);

	return (
		<>
			<Helmet />

			<StyledApp>
				<Header />

				<ScContent>
					<Nav />
					<Container>
						<Routes />
					</Container>
				</ScContent>
			</StyledApp>

			<AuthModal />
			<GenericModal />
		</>
	);
};

const StyledApp = styled.div`
	height: 100vh;
`;

const ScContent = styled.div`
	display: flex;
	height: calc(100vh - ${props => props.theme.headerHeight});
`;

export default withRouter(
	connect(
		null,
		{ setCurrentUser, setNotificationsData }
	)(App)
);
