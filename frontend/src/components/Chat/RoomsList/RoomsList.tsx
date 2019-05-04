import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { IChat } from '../../../types/interfaces';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';
import { IChatProps } from '../Chat';
import RoomsListLoader from './RoomsListLoader';

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

const RoomsList = (props: IChatProps) => (
	<Query query={ROOMS_LIST_QUERY}>
		{({ loading, data }) => {
			return (
				<ScRoomsList>
					{loading
						? Array.from({ length: 15 }).map((_, i) => (
								<RoomsListLoader key={i} />
						  ))
						: data.roomsList.map((room: IChat) => (
								<RoomsListItem
									selected={room.slug === props.match.params.chatSlug}
									room={room}
									key={room.slug}
								/>
						  ))}
				</ScRoomsList>
			);
		}}
	</Query>
);

const ScRoomsList = styled.div`
	background: ${props => props.theme.roomsListBackground};
	grid-column: 1 / 2;
	overflow: hidden;

	&:hover {
		overflow-y: auto;
	}
`;

export default RoomsList;
