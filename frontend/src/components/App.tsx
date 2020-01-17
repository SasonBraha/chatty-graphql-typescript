import React from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import Nav from './Nav';
import Container from './Container';
import { withRouter } from 'react-router-dom';
import { GenericModal } from './Shared';
import Routes from './Routes';
import { RouterProps } from 'react-router';
import { hot } from 'react-hot-loader/root';
import {
	useCheckAuth,
	useGetInitialUserData,
	useNotificationsSubscription,
	useShowAlertsFromStorage
} from '../hooks/setup';

interface IProps extends RouterProps {}
const App: React.FC<IProps> = props => {
	useCheckAuth();
	useGetInitialUserData();
	useNotificationsSubscription();
	useShowAlertsFromStorage();

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

export default withRouter(hot(App));
