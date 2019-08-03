import React from 'react';
import gql from 'graphql-tag';
import { IChat } from '../../../types/interfaces';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';
import RoomsListLoader from './RoomsListLoader';
import { useQuery, useSubscription } from 'react-apollo-hooks';
import { setTypingUsers } from '../../../apollo/actions';
import { useLocalCache } from '../../Shared/Hooks';

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

interface IProps {}

const RoomsList: React.FC<IProps> = props => {
	const { data, loading } = useQuery(ROOMS_LIST_QUERY);
	const {
		chat: { chatSlug, typingUsers }
	} = useLocalCache(`
		chat {
			chatSlug
			typingUsers
		}
	`);

	useSubscription(TYPING_USERS_SUBSCRIPTION, {
		onSubscriptionData({ subscriptionData }) {
			const {
				data: {
					subscribeToTypingUsersUpdates: { chatSlug, crudType, user }
				}
			} = subscriptionData;
			setTypingUsers(user, crudType, chatSlug);
		}
	});

	return (
		<S.RoomsList>
			{loading
				? Array.from({ length: 15 }).map((_, i) => <RoomsListLoader key={i} />)
				: data &&
				  data.roomsList &&
				  data.roomsList.map((room: IChat) => (
						<RoomsListItem
							selected={room.slug === chatSlug}
							room={room}
							key={room.slug}
							chatSlug={room.slug}
							typingUsers={typingUsers[room.slug] ? typingUsers[room.slug] : []}
						/>
				  ))}
		</S.RoomsList>
	);
};

const S: any = {};
S.RoomsList = styled.div`
	background: ${props => props.theme.roomsListBackground};
	grid-column: 1 / 2;
	overflow: hidden;

	&:hover {
		overflow-y: auto;
	}
`;

export default RoomsList;
