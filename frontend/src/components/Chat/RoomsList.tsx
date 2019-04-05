import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { IChat } from '../../models';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';

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

const RoomsList = () => (
	<Query query={ROOMS_LIST_QUERY}>
		{({ loading, data }) => {
			if (loading) return 'Loading...';

			return (
				<ScRoomsList>
					{data.roomsList.map((room: IChat) => (
						<RoomsListItem room={room} key={room.slug} />
					))}
				</ScRoomsList>
			);
		}}
	</Query>
);

const ScRoomsList = styled.div`
	background: ${props => props.theme.roomsListBackground};
	grid-column: 1 / 2;
`;

export default RoomsList;
