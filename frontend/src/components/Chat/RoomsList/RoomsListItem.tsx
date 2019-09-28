import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { ITypingUser } from '../../../types/interfaces';
import Ripple from 'react-ink';
import TypingUsers from '../TypingUsers';

interface IProps {
	room: any;
	selected: boolean;
	chatSlug: string;
	typingUsers: ITypingUser[];
}

const RoomsListItem = ({ room, selected, chatSlug, typingUsers }: IProps) => (
	<S.RoomsListItem selected={selected} to={`/chat/${room.slug}`}>
		<S.Image src={room.image.path} alt={room.name} />

		<S.RoomData>
			<S.RoomName>{room.name}</S.RoomName>
			<S.LastMessage shouldHide={typingUsers.length > 0}>
				{room.lastMessage}
			</S.LastMessage>
			<S.TypingUsers chatSlug={chatSlug} />
		</S.RoomData>

		<Ripple />
	</S.RoomsListItem>
);

const S: any = {};
S.RoomsListItem = styled(Link)<{ selected: boolean }>`
	display: flex;
	align-items: center;
	padding: 1rem;
	position: relative;
	transition: 0.3s;
	border-right: 0rem solid transparent;

	&:hover {
		background: ${props => props.theme.activeUsersBackground};
	}

	${({ selected }) =>
		selected &&
		css`
			border-right: 0.5rem solid ${props => props.theme.ownMessageBackground};
			background: ${props => props.theme.activeUsersBackground};
		`}
`;

S.Image = styled.img`
	width: 3.7rem;
	height: 3.7rem;
	border-radius: 50%;
`;

S.RoomData = styled.div`
	margin-right: 1rem;
	transform: translateY(-0.35rem);
	max-width: 80%;
`;

S.RoomName = styled.div`
	color: white;
`;

S.LastMessage = styled('div')<{ shouldHide: boolean }>`
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

S.TypingUsers = styled(TypingUsers)`
	color: ${props => props.theme.gray20};
	font-size: 1.4rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export default RoomsListItem;
