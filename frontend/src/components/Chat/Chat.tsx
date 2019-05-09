import React, { useEffect, useState } from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import ActiveUsers from './ActiveUsers';
import MessagesList from './MessagesList';
import SendMessage from './SendMessage';
import UploadPreview from './UploadPreview';
import { connect } from 'react-redux';
import { setChatSlug, setTypingUsers } from '../../redux/actions';
import Subscription from 'react-apollo/Subscriptions';
import gql from 'graphql-tag';

const TYPING_USERS_SUBSCRIPTION = gql`
	subscription {
		subscribeToTypingUsersUpdates {
			crudType
			chatSlug
			user {
				displayName
				slug
			}
		}
	}
`;

interface IMatchParams {
	chatSlug: string;
}
export interface IChatProps extends RouteComponentProps<IMatchParams> {
	setChatSlug: typeof setChatSlug;
	setTypingUsers: typeof setTypingUsers;
}

const Chat = (props: IChatProps) => {
	const [filePreview, setFilePreview] = useState(null);
	useEffect(() => {
		props.setChatSlug(props.match.params.chatSlug);
	}, [props.match.params.chatSlug]);

	return (
		<>
			<ScChat>
				<RoomsList {...props} />
				<ActiveUsers {...props} />

				<ScMessagesArea>
					<UploadPreview file={filePreview} />
					<MessagesList {...props} />
					<SendMessage {...props} setFilePreview={setFilePreview} />
				</ScMessagesArea>
			</ScChat>

			<Subscription
				subscription={TYPING_USERS_SUBSCRIPTION}
				onSubscriptionData={({
					subscriptionData: {
						data: {
							subscribeToTypingUsersUpdates: { chatSlug, crudType, user }
						}
					}
				}) => props.setTypingUsers(user, crudType, chatSlug)}
			/>
		</>
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
	{ setChatSlug, setTypingUsers }
)(Chat);
