import React, { useState } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers/ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';
import UploadPreview from './UploadPreview';
import UserTyping from './UserTyping';

interface IMatchParams {
	chatSlug: string;
}
export interface IChatProps extends RouteComponentProps<IMatchParams> {}

const Chat = (props: IChatProps) => {
	const [filePreview, setFilePreview] = useState(null);

	return (
		<ScChat>
			<RoomsList {...props} />
			<ActiveUsers {...props} />

			<ScMessagesArea>
				<UploadPreview file={filePreview} />
				<MessagesList {...props} />
				<SendMessage {...props} setFilePreview={setFilePreview} />
				<UserTyping {...props} />
			</ScMessagesArea>
		</ScChat>
	);
};

const ScChat = styled.div`
	display: grid;
	grid-template-columns: 25rem 5rem 1fr;
	height: 100%;
`;

const ScMessagesArea = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - ${props => props.theme.headerHeight});
	position: relative;
	overflow: hidden;
`;

export default Chat;
