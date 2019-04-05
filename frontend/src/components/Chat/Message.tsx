import React from 'react';
import { IMessage } from '../../models';
import styled, { css } from 'styled-components';
import formatRelative from 'date-fns/formatRelative';
import he from 'date-fns/locale/he';

interface IProps {
	message: IMessage;
	isMine: boolean;
}

const Message = (props: IProps) => {
	return (
		<ScMessage isMine={props.isMine}>
			<ScMetaData>{props.message.createdBy.displayName}</ScMetaData>
			<ScText>{props.message.text}</ScText>
			<ScMetaData alignLeft={true}>
				{formatRelative(props.message.createdAt, new Date(), {
					locale: he
				})}
			</ScMetaData>
		</ScMessage>
	);
};

const ScMessage = styled('div')<{ isMine: boolean }>`
	padding: 0.5rem 1rem;
	align-self: flex-start;
	border-radius: 0.5rem;
	align-self: flex-end;
	min-width: 25rem;
	max-width: 50rem;
	max-height: 40rem;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	background: white;
	color: black;
	word-break: break-word;
	position: relative;
	margin-top: 0.9rem;

	${({ isMine }) =>
		isMine &&
		css`
			align-self: flex-start;
			background: ${props => props.theme.ownMessageBackground};
			color: white;
		`}
`;

const ScMetaData = styled('small')<{ alignLeft?: boolean }>`
	font-size: 1.34rem;
	color: #a9a9a9;
	display: block;
	${({ alignLeft }) =>
		alignLeft &&
		css`
			text-align: left;
		`}
`;

const ScText = styled.div`
	padding: 0.5rem 0;
`;

export default Message;
