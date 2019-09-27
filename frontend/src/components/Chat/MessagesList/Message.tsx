import React, { Component } from 'react';
import { IMessage } from '../../../types/interfaces';
import styled, { css } from 'styled-components/macro';
import formatRelative from 'date-fns/formatRelative';
import he from 'date-fns/locale/he';
import { parseISO } from 'date-fns';
import { CrudEnum } from '../../../types/enums';
import { Editable, Image } from '../../Shared';
import { IMessageCtxMenu } from './MessagesList';
import reactStringReplace from 'react-string-replace';
import { Link } from 'react-router-dom';
import { withTranslation } from '../../Shared/Hoc';
import {
	UpdateMessageMutationFn,
	UpdateMessageProps,
	withUpdateMessage
} from '../../../__generated__/graphql';

interface IProps extends UpdateMessageProps {
	message: IMessage;
	isMine: boolean;
	setMessageCtxMenu: (ctx: IMessageCtxMenu) => void;
	t?: any;
	updateMessage: UpdateMessageMutationFn;
}

interface IState {
	messageBody: string;
	isEditable: boolean;
	isMediaLoaded: boolean;
	isDeleted: boolean;
}

@withTranslation()
class Message extends Component<IProps, IState> {
	state = {
		messageBody: this.props.message.text,
		isEditable: false,
		isMediaLoaded: false,
		isDeleted: false
	};

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		if (prevProps.message.text !== this.props.message.text) {
			this.setState({ messageBody: this.props.message.text });
		}
	}

	handleContextMenu = (e: React.MouseEvent) => {
		const { setMessageCtxMenu, isMine, message } = this.props;
		const { isDeleted, isEditable } = this.state;
		const shouldShowCustomContextMenu = isMine && !isDeleted && !isEditable;
		if (shouldShowCustomContextMenu) {
			e.preventDefault();
			setMessageCtxMenu({
				isOpen: true,
				message: message,
				position: {
					y: e.pageY - 52,
					x: e.pageX
				},
				setEditable: (value: boolean) => this.setState({ isEditable: value }),
				deleteMessage: this.deleteMessage
			});
		}
	};

	handleEditableBlur = async () => {
		this.setState({ isEditable: false });
		if (this.props.message.text !== this.state.messageBody) {
			await this.props.updateMessage({
				variables: {
					messageId: this.props.message._id,
					crudType: CrudEnum.UPDATE,
					messageText: this.state.messageBody,
					creationToken: this.props.message.creationToken,
					chatSlug: this.props.message.chatSlug
				}
			});
		}
	};

	renderFile = () => {
		const { file, _id } = this.props.message;
		if (file) {
			const { width, height } = file.dimensions;
			const MAX_HEIGHT = 320;
			const MAX_WIDTH = 480;

			return (
				<S.Image
					src={`${process.env.REACT_APP_S3_BUCKET_URL}/${file.path}`}
					id={_id}
					maxWidth={MAX_WIDTH}
					maxHeight={MAX_HEIGHT}
					naturalWidth={width}
					naturalHeight={height}
					onLoad={() => {
						this.setState({
							isMediaLoaded: true
						});
					}}
					lazy
				/>
			);
		}
	};

	renderText = () => {
		const {
			message: { userMentions, text }
		} = this.props;
		const { messageBody } = this.state;

		if (userMentions && userMentions.length) {
			const mentionRegex = new RegExp('(@[\\wא-ת-_]+)', 'g');
			return reactStringReplace(messageBody, mentionRegex, (match, i) => {
				const displayName = match.slice(1);
				const userDataIndex = userMentions.findIndex(
					mention => mention.displayName === displayName
				);
				if (userDataIndex !== -1) {
					const userData = userMentions[userDataIndex];
					return (
						<S.Mention key={i} to={`/user/${userData.slug}`}>
							{displayName}
						</S.Mention>
					);
				}
				return match;
			});
		} else {
			return text;
		}
	};

	deleteMessage = async () => {
		await this.props.updateMessage({
			variables: {
				messageId: this.props.message!._id,
				crudType: CrudEnum.DELETE,
				creationToken: this.props.message.creationToken,
				chatSlug: this.props.message.chatSlug
			}
		});
		this.setState({
			isDeleted: true
		});
	};

	render() {
		const {
			message: { createdBy, text, createdAt },
			isMine
		} = this.props;
		const { isDeleted } = this.state;
		return (
			<S.Message
				isMine={isMine}
				isDeleted={isDeleted}
				onContextMenu={this.handleContextMenu}
			>
				{isDeleted ? (
					<S.Text>{this.props.t('chat.messageDeleted')}</S.Text>
				) : (
					<>
						<S.MetaData>{createdBy.displayName}</S.MetaData>
						{this.renderFile()}
						{this.state.isEditable ? (
							<S.Editable
								onChange={(e: any) =>
									this.setState({ messageBody: e.target.value })
								}
								onCancel={() =>
									this.setState({
										messageBody: text,
										isEditable: false
									})
								}
								html={this.state.messageBody}
								submitOnEnter={true}
								onBlur={this.handleEditableBlur}
								isMine={isMine}
							/>
						) : (
							<S.Text>{this.renderText()}</S.Text>
						)}

						<S.MetaData alignLeft={true}>
							{formatRelative(
								parseISO((createdAt as unknown) as string),
								new Date(),
								{
									locale: he
								}
							)}
						</S.MetaData>
					</>
				)}
			</S.Message>
		);
	}
}

const S: any = {};
S.Message = styled('div')<{
	isMine: boolean;
	isDeleted: boolean;
}>`
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

	${({ isMine }) =>
		isMine &&
		css`
			align-self: flex-start;
			background: ${props => props.theme.ownMessageBackground};
			color: white;
		`}

	${({ isDeleted }) =>
		isDeleted &&
		css`
			min-width: initial;
			opacity: 0.6;
			filter: blur(1.5px);
		`}
`;

S.MetaData = styled('small')<{ alignLeft?: boolean }>`
	font-size: 1.34rem;
	color: #a9a9a9;
	display: block;
	${({ alignLeft }) =>
		alignLeft &&
		css`
			text-align: left;
		`}
`;

S.Image = styled(Image)`
	max-height: 32rem;
	max-width: 100%;
	border-radius: 0.35rem;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	margin-top: 0.3rem;
`;

S.Text = styled.p`
	padding: 0.5rem 0;
`;

S.Mention = styled(Link)`
	font-weight: bold;
	letter-spacing: 0.05rem;
	background: rgba(0, 0, 0, 0.1);
	border-radius: 0.5rem;
	padding: 0 0.5rem;
	cursor: pointer;
`;

S.Editable = styled(({ isMine, ...rest }) => <Editable {...rest} />)<{
	isMine: boolean;
}>`
	&[contenteditable='true'] {
		background: #0268c7;
		padding: 0.7rem;
		border-radius: 0.3rem;
		margin: 1rem 0 0.7rem 0;
		border: 1px dashed;
		outline: none;

		${({ isMine }) =>
			!isMine &&
			css`
				background: #ececec;
				border: 1px dashed #767676;
			`}
	}
`;

S.MediaLoader = styled('div')<{ isMediaLoaded: boolean }>`
	position: relative;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: white;
		opacity: 1;
		visibility: visible;
		transition: 0.3s;
		z-index: 1;
	}

	${({ isMediaLoaded }) =>
		isMediaLoaded &&
		css`
			&:before {
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
			}
		`}
`;

export default withUpdateMessage({ name: 'updateMessage' })(Message);
