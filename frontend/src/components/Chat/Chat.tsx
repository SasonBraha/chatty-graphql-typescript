import React, { useEffect, useState } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';
import UploadPreview from './UploadPreview';
import { withAuth } from '../Shared/Hoc';
import { setChatSlug } from '../../apollo/actions';

interface IMatchParams {
	chatSlug: string;
}
export interface IChatProps extends RouteComponentProps<IMatchParams> {}

const Chat = (props: IChatProps) => {
	const [filePreview, setFilePreview] = useState(null);
	const { chatSlug } = props.match.params;
	useEffect(() => {
		setChatSlug(chatSlug);
	}, [chatSlug]);

	return (
		<S.Chat>
			<RoomsList />
			<ActiveUsers />

			<S.MessagesArea>
				<UploadPreview file={filePreview} />
				<MessagesList {...props} />
				{/*
 // @ts-ignore */}
				<SendMessage {...props} setFilePreview={setFilePreview} />
			</S.MessagesArea>
		</S.Chat>
	);
};

const S: any = {};
S.Chat = styled.div`
	display: grid;
	grid-template-columns: 25rem 5rem 1fr;
	height: 100%;
`;

S.MessagesArea = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - ${props => props.theme.headerHeight});
	position: relative;
`;

export default withAuth(Chat);
