import React, { useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';
import jwtDecode from 'jwt-decode';
import { IUser } from '../types/interfaces';
import Nav from './Nav';
import Container from './Container';
import { withRouter } from 'react-router-dom';
import { GenericModal } from './Shared';
import Routes from './Routes';
import { LocalStorageEnum, UserUpdatesEnum } from '../types/enums';
import {
	setCurrentUser,
	setGenericModal,
	setNotificationsData
} from '../apollo/actions';
import { useLocalCache } from './Shared/Hooks';
import { USER_ENTITY_FRAGMENT } from '../apollo/fragments';
import { RouterProps } from 'react-router';
import { hot } from 'react-hot-loader/root';
import {
	useMeLazyQuery,
	useUserUpdatesSubscription
} from '../__generated__/graphql';

interface IProps extends RouterProps {}

const App: React.FC<IProps> = props => {
	const { data: userUpdatesData, loading } = useUserUpdatesSubscription();
	const {
		currentUser,
		notifications: { unreadCount }
	} = useLocalCache(`
		currentUser {
			${USER_ENTITY_FRAGMENT}
		}
		notifications {
			unreadCount
		}
	`);
	const [execMeQuery, { data: meData }] = useMeLazyQuery();

	useLayoutEffect(() => {
		const onLoadMessage = localStorage.getItem(
			LocalStorageEnum.ON_LOAD_MESSAGE
		);
		if (onLoadMessage) {
			const { message, type } = JSON.parse(onLoadMessage);
			setGenericModal(type, message);
			localStorage.removeItem(LocalStorageEnum.ON_LOAD_MESSAGE);
		}

		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);

		if (accessToken) {
			setCurrentUser(jwtDecode<IUser>(accessToken));
		}
	}, []);

	useEffect(() => {
		if (currentUser) {
			execMeQuery();
		}
	}, [currentUser]);

	useEffect(() => {
		if (meData) {
			setNotificationsData({
				unreadCount: meData.me.unreadNotificationsCount
			});
		}
	}, [meData]);

	useEffect(() => {
		if (!loading && userUpdatesData) {
			const updateData = JSON.parse(userUpdatesData.userUpdates);
			switch (updateData.type) {
				case UserUpdatesEnum.NEW_NOTIFICATION:
					setNotificationsData({
						unreadCount: unreadCount + 1
					});
					break;
			}
		}
	}, [userUpdatesData]);

	return (
		<>
			<S.App>
				<Header />

				<S.Content>
					<Nav />
					<Container>
						<Routes />
					</Container>
				</S.Content>
			</S.App>

			<AuthModal />
			<GenericModal />
		</>
	);
};

const S: any = {};
S.App = styled.div`
	height: 100vh;
`;

S.Content = styled.div`
	display: flex;
	height: calc(100vh - ${props => props.theme.headerHeight});
`;

// @ts-ignore
export default withRouter(hot(App));
