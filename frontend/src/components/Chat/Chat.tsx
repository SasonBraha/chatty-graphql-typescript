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
				<RoomsList {...this.props} />
				<ActiveUsers />

				<ScMessagesArea>
					{/*
// @ts-ignore */}
					<MessagesList {...this.props} />
					<SendMessage {...this.props} />
				</ScMessagesArea>
			</ScChat>
		);
	}
}

const ScChat = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr 9fr;
	height: 100%;
`;

const ScMessagesArea = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - ${props => props.theme.headerHeight});
`;

export default Chat;
