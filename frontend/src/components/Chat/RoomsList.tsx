import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { IChat } from '../../models';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';

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

interface IMatchParams {
	chatSlug?: string;
}

const RoomsList = (props: RouteComponentProps<IMatchParams>) => (
	<Query query={ROOMS_LIST_QUERY}>
		{({ loading, data }) => {
			if (loading) return 'Loading...';

			return (
				<ScRoomsList>
					{data.roomsList.map((room: IChat) => (
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
`;

export default RoomsList;
