import React, { Component, lazy, Suspense } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/actions';
import { IUser } from '../models';
import Nav from './Nav';
import Container from './Container';
import { Switch, Route, withRouter } from 'react-router-dom';

const Chat = lazy(() => import('./Chat'));

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
							<Suspense fallback={<div>Loading...</div>}>
								<Switch>
									<Route
										exact
										path='/chat'
										render={props => <Chat {...props} />}
									/>
									<Route
										exact
										path='/chat/:chatId'
										render={props => <Chat {...props} />}
									/>
								</Switch>
							</Suspense>
						</Container>
					</ScContent>
				</StyledApp>

				<AuthModal />
			</>
		);
	}
}

const StyledApp = styled.div`
	display: grid;
	grid-template-rows: 5.5rem 1fr;
	height: 100vh;
`;

const ScContent = styled.div`
	display: flex;
	height: 100%;
`;

export default withRouter(
	connect(
		null,
		{ setCurrentUser }
	)(App)
);
