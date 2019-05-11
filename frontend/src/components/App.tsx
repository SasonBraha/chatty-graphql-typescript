import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/actions';
import { IUser } from '../types/interfaces';
import Nav from './Nav';
import Container from './Container';
import { withRouter } from 'react-router-dom';
import { GenericModal } from './Shared';
import Routes from './Routes';

interface IProps {
	setCurrentUser: typeof setCurrentUser;
}

class App extends Component<IProps> {
	constructor(props: IProps) {
		super(props);
		this.init();
	}

	private init() {
		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);
		if (accessToken) {
			this.props.setCurrentUser(jwtDecode<IUser>(accessToken));
		}
	}

	render() {
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
	}
}

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
		{ setCurrentUser }
	)(App)
);
