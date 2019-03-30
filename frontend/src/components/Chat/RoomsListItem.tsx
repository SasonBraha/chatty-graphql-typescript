import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { IChat } from '../../models';
import Ripple from 'react-ink';

const RoomsListItem = ({ room }: { room: IChat }) => (
	<ScRoomsListItem to={`/chat/${room.slug}`}>
		<figure>
			<ScImage src={room.image.link} />
		</figure>

		<ScRoomData>
			<ScRoomName>{room.name}</ScRoomName>
			<ScLastMessage>{room.lastMessage}</ScLastMessage>
		</ScRoomData>

		<Ripple />
	</ScRoomsListItem>
);

const ScRoomsListItem = styled(Link)`
	display: flex;
	align-items: center;
	padding: 10px;
	position: relative;
`;

const ScImage = styled.img`
	width: 3.7rem;
	height: 3.7rem;
	border-radius: 50%;
`;

const ScRoomData = styled.div`
	margin-right: 10px;
	transform: translateY(-0.35rem);
`;

const ScRoomName = styled.div`
	color: white;
`;

const ScLastMessage = styled.div`
	font-size: 1.4rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: ${props => props.theme.gray20};
`;

export default RoomsListItem;
