import React, { Component } from 'react';
import styled from 'styled-components/macro';
import Header from './Header';

class App extends Component {
	render() {
		return (
			<StyledApp>
				<Header />
			</StyledApp>
		);
	}
}

const StyledApp = styled.div`
	display: grid;
	grid-template-rows: 5.5rem 1fr;
`;

export default App;
