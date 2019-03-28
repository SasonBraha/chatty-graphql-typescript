import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/actions';
import { IUser } from '../models';

interface IProps {
	setCurrentUser: typeof setCurrentUser;
}

const App = (props: IProps) => {
	useEffect(() => {
		// Set Current User
		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);
		if (accessToken) {
			props.setCurrentUser(jwtDecode<IUser>(accessToken));
		}
	}, []);

	return (
		<>
			<StyledApp>
				<Header />
			</StyledApp>

			<AuthModal />
		</>
	);
};

const StyledApp = styled.div`
	display: grid;
	grid-template-rows: 5.5rem 1fr;
`;

export default connect(
	null,
	{ setCurrentUser }
)(App);
