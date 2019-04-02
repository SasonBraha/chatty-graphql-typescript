import React, { Component } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';

interface IProps extends RouteComponentProps {}

class Chat extends Component<IProps> {
	constructor(props: IProps) {
		super(props);
		this.init();
	}

	private init() {}

	render() {
		return (
			<ScChat>
				<RoomsList />
				<ActiveUsers />
				<MessagesList {...this.props} />
				<SendMessage />
			</ScChat>
		);
	}
}

const ScChat = styled.div`
	display: grid;
	height: 100%;
	grid-template-columns: 2fr 1fr 9fr;
	grid-auto-flow: dense;
`;

export default Chat;
