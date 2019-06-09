import React from 'react';
import gql from 'graphql-tag';
import { IChat, ITypingUser } from '../../../types/interfaces';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';
import RoomsListLoader from './RoomsListLoader';
import { IReducerState } from '../../../redux/reducers';
import { connect } from 'react-redux';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import { setTypingUsers } from '../../../redux/actions';

const ROOMS_LIST_QUERY = gql`
	query {
		roomsList {
			_id
			name
			image {
				path
				isStored
			}
			slug
			lastMessage
		}
	}
`;

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

interface IProps {
	chatSlug: string;
	typingUsers: {
		[key: string]: ITypingUser[];
	};
	setTypingUsers: typeof setTypingUsers;
}

const RoomsList: React.FC<IProps> = props => {
	const { data, loading } = useQuery(ROOMS_LIST_QUERY);
	useSubscription(TYPING_USERS_SUBSCRIPTION, {
		onSubscriptionData({ subscriptionData }) {
			const {
				data: {
					subscribeToTypingUsersUpdates: { chatSlug, crudType, user }
				}
			} = subscriptionData;
			props.setTypingUsers(user, crudType, chatSlug);
		}
	});

	return (
		<ScRoomsList>
			{loading
				? Array.from({ length: 15 }).map((_, i) => <RoomsListLoader key={i} />)
				: data.roomsList.map((room: IChat) => (
						<RoomsListItem
							selected={room.slug === props.chatSlug}
							room={room}
							key={room.slug}
							chatSlug={room.slug}
							typingUsers={
								props.typingUsers[room.slug] ? props.typingUsers[room.slug] : []
							}
						/>
				  ))}
		</ScRoomsList>
	);
};

const ScRoomsList = styled.div`
	background: ${props => props.theme.roomsListBackground};
	grid-column: 1 / 2;
	overflow: hidden;

	&:hover {
		overflow-y: auto;
	}
`;

const mapStateToProps = ({
	chat: { typingUsers, chatSlug }
}: IReducerState) => ({
	typingUsers,
	chatSlug
});
export default connect(
	mapStateToProps,
	{ setTypingUsers }
)(RoomsList);
