import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { IChat } from '../../models';

const RoomsListItem = ({ room }: { room: IChat }) => (
	<ScRoomsListItem to={`/chat/${room.slug}`}>
		<figure>
			<ScImage src={room.image.link} />
		</figure>

		<div>
			<ScRoomName>{room.name}</ScRoomName>
			<ScLastMessage>{room.lastMessage}</ScLastMessage>
		</div>
	</ScRoomsListItem>
);

const ScRoomsListItem = styled(Link)`
	display: flex;
	align-items: center;
`;

const ScImage = styled.img`
	width: 3.7rem;
	height: 3.7rem;
	border-radius: 50%;
`;

const ScRoomName = styled.div`
	color: white;
`;

const ScLastMessage = styled.div`
	font-size: 1.4rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export default RoomsListItem;
