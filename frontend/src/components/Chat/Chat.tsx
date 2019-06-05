import React, { useEffect, useState } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';
import UploadPreview from './UploadPreview';
import { connect } from 'react-redux';
import { setChatSlug } from '../../redux/actions';
import { withAuth } from '../Shared/Hoc';

interface IMatchParams {
	chatSlug: string;
}
export interface IChatProps extends RouteComponentProps<IMatchParams> {
	setChatSlug: typeof setChatSlug;
}

const Chat = (props: IChatProps) => {
	const [filePreview, setFilePreview] = useState(null);
	useEffect(() => {
		props.setChatSlug(props.match.params.chatSlug);
	}, [props.match.params.chatSlug]);

	return (
		<ScChat>
			<RoomsList />
			<ActiveUsers />

			<ScMessagesArea>
				<UploadPreview file={filePreview} />
				<MessagesList {...props} />
				<SendMessage {...props} setFilePreview={setFilePreview} />
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

export default connect(
	null,
	{ setChatSlug }
)(withAuth(Chat));
