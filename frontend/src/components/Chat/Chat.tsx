import React, { Component } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';
import { th } from 'date-fns/esm/locale';

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

				<ScMessagesArea>
					<MessagesList {...this.props} />
					<SendMessage {...this.props} />
				</ScMessagesArea>
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

const ScMessagesArea = styled.div`
	display: flex;
	flex-direction: column;
`;

export default Chat;
