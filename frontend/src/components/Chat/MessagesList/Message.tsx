import React, { useEffect } from 'react';
import { IMessage } from '../../../models';
import styled, { css } from 'styled-components';
import formatRelative from 'date-fns/formatRelative';
import he from 'date-fns/locale/he';
import { connect } from 'react-redux';
import { setMessageContextMenu } from '../../../redux/actions';
import { parseISO } from 'date-fns';

interface IProps {
	message: IMessage;
	isMine: boolean;
	setMessageContextMenu: typeof setMessageContextMenu;
}

interface IStyledProps {
	isMine: boolean;
	isClientDeleted: boolean | null;
}

const renderFile = (message: IMessage) => {
	const { file } = message;
	if (file) {
		return (
			<ScImage
				src={`${process.env.REACT_APP_S3_BUCKET_URL}/${file.path}`}
				id={message._id}
			/>
		);
	}
};

const handleContextMenu = (e: React.MouseEvent, props: IProps) => {
	if (props.isMine && !props.message.isClientDeleted) {
		e.preventDefault();
		props.setMessageContextMenu({
			isOpen: true,
			message: props.message,
			position: {
				y: e.pageY - 52,
				x: e.pageX
			}
		});
	}
};

const Message: React.FC<IProps> = props => {
	return (
		<ScMessage
			isMine={props.isMine}
			isClientDeleted={props.message.isClientDeleted}
			onContextMenu={(e: React.MouseEvent) => handleContextMenu(e, props)}
		>
			{props.message.isClientDeleted ? (
				<ScText>הודעה זו נמחקה</ScText>
			) : (
				<>
					<ScMetaData>{props.message.createdBy.displayName}</ScMetaData>
					{renderFile(props.message)}
					<ScText>{props.message.text}</ScText>
					<ScMetaData alignLeft={true}>
						{formatRelative(
							parseISO((props.message.createdAt as unknown) as string),
							new Date(),
							{
								locale: he
							}
						)}
					</ScMetaData>
				</>
			)}
		</ScMessage>
	);
};

const ScMessage = styled('div')<IStyledProps>`
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	align-self: flex-end;
	min-width: 25rem;
	max-width: 50rem;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	background: white;
	color: black;
	word-break: break-word;
	position: relative;

	&:not(:first-of-type) {
		margin-top: 1.3rem;
	}

	&:last-of-type {
		margin-bottom: 1rem;
	}

	${({ isMine }) =>
		isMine &&
		css`
			align-self: flex-start;
			background: ${props => props.theme.ownMessageBackground};
			color: white;
		`}

	${({ isClientDeleted }) =>
		isClientDeleted &&
		css`
			min-width: initial;
			opacity: 0.6;
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

const ScImage = styled.img`
	max-height: 32rem;
	max-width: 100%;
	border-radius: 0.35rem;
	border: 0.1rem solid ${props => props.theme.gray30};
	margin-top: 0.3rem;
`;

const ScText = styled.p`
	padding: 0.5rem 0;
`;

export default connect(
	null,
	{ setMessageContextMenu }
)(Message);
