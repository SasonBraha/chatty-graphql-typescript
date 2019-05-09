import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { IChat, ITypingUser, ITypingUsers } from '../../../types/interfaces';
import Ripple from 'react-ink';
import TypingUsers from '../TypingUsers';

interface IProps {
	room: IChat;
	selected: boolean;
	chatSlug: string;
	typingUsers: ITypingUser[];
}

const RoomsListItem = ({ room, selected, chatSlug, typingUsers }: IProps) => (
	<ScRoomsListItem selected={selected} to={`/chat/${room.slug}`}>
		<ScImage src={room.image.path} alt={room.name} />

		<ScRoomData>
			<ScRoomName>{room.name}</ScRoomName>
			<ScLastMessage shouldHide={!!typingUsers.length}>
				{room.lastMessage}
			</ScLastMessage>
			<ScTypingUsers chatSlug={chatSlug} />
		</ScRoomData>

		<Ripple />
	</ScRoomsListItem>
);

const ScRoomsListItem = styled(Link)<{ selected: boolean }>`
	display: flex;
	align-items: center;
	padding: 1rem;
	position: relative;
	transition: 0.3s;

	${({ selected }) =>
		selected &&
		css`
			border-right: 0.5rem solid ${props => props.theme.ownMessageBackground};
			background: ${props => props.theme.activeUsersBackground};
		`}
`;

const ScImage = styled.img`
	width: 3.7rem;
	height: 3.7rem;
	border-radius: 50%;
`;

const ScRoomData = styled.div`
	margin-right: 1rem;
	transform: translateY(-0.35rem);
	max-width: 80%;
`;

const ScRoomName = styled.div`
	color: white;
`;

const ScLastMessage = styled('div')<{ shouldHide: boolean }>`
	font-size: 1.4rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: ${props => props.theme.gray20};

	${({ shouldHide }) =>
		shouldHide &&
		css`
			display: none;
		`}
`;

const ScTypingUsers = styled(TypingUsers)`
	color: ${props => props.theme.gray20};
	font-size: 1.4rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export default RoomsListItem;
