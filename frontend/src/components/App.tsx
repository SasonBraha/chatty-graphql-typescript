import React, { useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import jwtDecode from 'jwt-decode';
import Nav from './Nav';
import Container from './Container';
import { withRouter } from 'react-router-dom';
import { GenericModal } from './Shared';
import Routes from './Routes';
import { LocalStorageEnum, UserUpdatesEnum } from '../types/enums';
import { RouterProps } from 'react-router';
import { hot } from 'react-hot-loader/root';
import {
	use_GetCurrentUserQuery,
	use_GetNotificationsDataQuery,
	use_SetGenericModalMutation,
	use_SetNotificationsDataMutation,
	use_UpdateCurrentUserMutation,
	useMeLazyQuery,
	useUserUpdatesSubscription
} from '../__generated__/graphql';

interface IProps extends RouterProps {}

const App: React.FC<IProps> = props => {
	const { data: userUpdatesData, loading } = useUserUpdatesSubscription();
	const [execMeQuery, { data: meData }] = useMeLazyQuery();
	const {
		data: { currentUser }
	} = use_GetCurrentUserQuery();
	const {
		data: {
			notificationsData: { unreadCount }
		}
	} = use_GetNotificationsDataQuery();
	const [updateCurrentUser] = use_UpdateCurrentUserMutation();
	const [setNotificationsData] = use_SetNotificationsDataMutation();
	const [setGenericModal] = use_SetGenericModalMutation();
	useLayoutEffect(() => {
		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);
		if (accessToken) {
			updateCurrentUser({
				variables: {
					user: jwtDecode(accessToken)
				}
			});
		}
	}, []);

	useEffect(() => {
		const onLoadMessage = localStorage.getItem(
			LocalStorageEnum.ON_LOAD_MESSAGE
		);
		if (onLoadMessage) {
			const { message, type } = JSON.parse(onLoadMessage);
			setGenericModal({
				variables: {
					data: {
						text: message,
						type
					}
				}
			});
			localStorage.removeItem(LocalStorageEnum.ON_LOAD_MESSAGE);
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
				variables: {
					data: {
						unreadCount: meData.me.unreadNotificationsCount
					}
				}
			});
		}
	}, [meData]);

	useEffect(() => {
		if (!loading && userUpdatesData) {
			const updateData = JSON.parse(userUpdatesData.userUpdates);
			switch (updateData.type) {
				case UserUpdatesEnum.NEW_NOTIFICATION:
					setNotificationsData({
						variables: {
							data: {
								unreadCount: unreadCount + 1
							}
						}
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
