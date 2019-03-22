import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';
import AuthModal from './Auth/AuthModal';

class App extends Component {
	render() {
		return (
			<>
				<StyledApp>
					<Header />
				</StyledApp>

				<AuthModal />
			</>
		);
	}
}

const StyledApp = styled.div`
	display: grid;
	grid-template-rows: 5.5rem 1fr;
`;

export default App;
