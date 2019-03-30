import React, { Component } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';

class Chat extends Component<RouteComponentProps> {
	render() {
		return (
			<ScChat>
				<RoomsList />
			</ScChat>
		);
	}
}

const ScChat = styled.div`
	display: grid;
	height: 100%;
	grid-template-columns: 2fr 1fr 7fr;
	grid-auto-flow: dense;
`;

export default Chat;
