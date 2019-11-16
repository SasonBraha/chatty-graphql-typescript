import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { use_SetCurrentChatSlugMutation } from '../../__generated__/graphql';
import ActiveUsers from './ActiveUsers';
import UploadPreview from './UploadPreview';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';
import { RouteComponentProps } from 'react-router';

interface IMatchParams {
	chatSlug: string;
}
export interface IChatActiveAreaProps
	extends RouteComponentProps<IMatchParams> {}
const ActiveArea: React.FC<IChatActiveAreaProps> = props => {
	const [filePreview, setFilePreview] = useState(null);
	const { chatSlug } = props.match.params;
	const [setCurrentChatSlug] = use_SetCurrentChatSlugMutation();

	useEffect(() => {
		setCurrentChatSlug({ variables: { slug: chatSlug } });
	}, [chatSlug]);

	useEffect(() => {
		return () => setCurrentChatSlug({ variables: { slug: '' } });
	}, []);

	return (
		<>
			<ActiveUsers />
			<S.ActiveArea>
				<UploadPreview file={filePreview} />
				<MessagesList {...props} />
				{/*
 // @ts-ignore */}
				<SendMessage {...props} setFilePreview={setFilePreview} />
			</S.ActiveArea>
		</>
	);
};

const S: any = {};
S.ActiveArea = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - ${props => props.theme.headerHeight});
	position: relative;
`;

export default ActiveArea;
