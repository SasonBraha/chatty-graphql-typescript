import React, { useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { setNotificationsData } from '../redux/actions';
import { IUser } from '../types/interfaces';
import Nav from './Nav';
import Container from './Container';
import { withRouter } from 'react-router-dom';
import { GenericModal } from './Shared';
import Routes from './Routes';
import { useApolloClient, useSubscription } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { UserUpdatesEnum } from '../types/enums';
import { IReducerState } from '../redux/reducers';
import { setCurrentUser } from '../apollo/actions';
import { useLocalCache } from './Shared/Hooks';
import { USER_ENTITY_FRAGMENT } from '../apollo/fragments';

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
	setNotificationsData: typeof setNotificationsData;
	unreadNotificationsCount: number;
	currentUser: IUser | null;
}

const App: React.FC<IProps> = props => {
	const client = useApolloClient();
	const { data, loading } = useSubscription(SUBSCRIBE_TO_USER_UPDATES);
	const { currentUser } = useLocalCache(`
		currentUser {
			${USER_ENTITY_FRAGMENT}
		}
	`);

	useLayoutEffect(() => {
		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);
		if (accessToken) {
			setCurrentUser(jwtDecode<IUser>(accessToken));
		}
	}, []);

	useEffect(() => {
		if (currentUser) {
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
		}
	}, [currentUser]);

	useEffect(() => {
		if (!loading && data) {
			const updateData = JSON.parse(data.userUpdates);
			switch (updateData.type) {
				case UserUpdatesEnum.NEW_NOTIFICATION:
					props.setNotificationsData({
						unread: props.unreadNotificationsCount + 1
					});
					break;
			}
		}
	}, [data]);

	return (
		<>
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

const mapStateToProps = ({ notifications: { unread } }: IReducerState) => ({
	unreadNotificationsCount: unread
});
export default withRouter(
	connect(
		mapStateToProps,
		{ setNotificationsData }
	)(App)
);
