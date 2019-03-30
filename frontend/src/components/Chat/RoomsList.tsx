import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { IChat } from '../../models';
import RoomsListItem from './RoomsListItem';

const ROOMS_LIST_QUERY = gql`
	query {
		roomsList {
			_id
			name
			slug
			lastMessage
			image {
				link
				isUploaded
			}
		}
	}
`;

const RoomsList = () => (
	<Query query={ROOMS_LIST_QUERY}>
		{({ loading, data }) => {
			if (loading) return 'Loading...';
			return data.roomsList.map((room: IChat) => (
				<RoomsListItem room={room} key={room.slug} />
			));
		}}
	</Query>
);

export default RoomsList;
