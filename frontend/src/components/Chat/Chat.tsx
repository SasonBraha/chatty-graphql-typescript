import React, { Component } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers/ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';

interface IMatchParams {
	chatSlug: string;
}
export interface IChatProps extends RouteComponentProps<IMatchParams> {}

class Chat extends Component<IChatProps> {
	constructor(props: IChatProps) {
		super(props);
		this.init();
	}

	private init() {}

	render() {
		return (
			<ScChat>
				<RoomsList {...this.props} />
				<ActiveUsers {...this.props} />

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
	grid-template-columns: 25rem 5rem 1fr;
	height: 100%;
`;

const ScMessagesArea = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - ${props => props.theme.headerHeight});
`;

export default Chat;
