import React, { Component } from 'react';
import { IMessage } from '../../../models';
import styled, { css } from 'styled-components';
import formatRelative from 'date-fns/formatRelative';
import he from 'date-fns/locale/he';
import { connect } from 'react-redux';
import { setMessageContextMenu } from '../../../redux/actions';
import { parseISO } from 'date-fns';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { CrudEnum } from '../../../types/enums';
import { Editable } from '../../Shared';

const UPDATE_MESSAGE_MUTATION = gql`
	mutation($messageId: ID!, $crudType: String!, $messageText: String) {
		updateMessage(
			updatePayload: {
				messageId: $messageId
				crudType: $crudType
				messageText: $messageText
			}
		)
	}
`;

const DELETE_MESSAGE_MUTATION = gql`
	mutation($messageId: ID!, $crudType: String!) {
		updateMessage(updatePayload: { messageId: $messageId, crudType: $crudType })
	}
`;

interface IProps {
	message: IMessage;
	isMine: boolean;
	setMessageContextMenu: typeof setMessageContextMenu;
	client?: ApolloClient<any>;
}

interface IState {
	messageBody: string;
	isEditable: boolean;
}

interface IStyledProps {
	isMine: boolean;
	isClientDeleted: boolean | null;
}

class Message extends Component<IProps, IState> {
	private editableEl: React.RefObject<HTMLElement> = React.createRef();
	constructor(props: IProps) {
		super(props);
		this.state = {
			messageBody: this.props.message.text,
			isEditable: false
		};
	}

	componentDidUpdate(prevProps: IProps, prevState: IState) {
		if (prevState.isEditable !== this.state.isEditable) {
			this.editableEl.current!.focus();
		}

		if (prevProps.message.text !== this.props.message.text) {
			this.setState({ messageBody: this.props.message.text });
		}
	}

	handleContextMenu = (e: React.MouseEvent) => {
		if (
			this.props.isMine &&
			!this.props.message.isClientDeleted &&
			!this.state.isEditable
		) {
			e.preventDefault();
			this.props.setMessageContextMenu({
				isOpen: true,
				message: this.props.message,
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
			await this.props.client!.mutate({
				mutation: UPDATE_MESSAGE_MUTATION,
				variables: {
					messageId: this.props.message._id,
					crudType: CrudEnum.UPDATE,
					messageText: this.state.messageBody
				}
			});
		}
	};

	renderFile = () => {
		const { file } = this.props.message;
		if (file) {
			return (
				<ScImage
					src={`${process.env.REACT_APP_S3_BUCKET_URL}/${file.path}`}
					id={this.props.message._id}
				/>
			);
		}
	};

	deleteMessage = async () => {
		await this.props.client!.mutate({
			mutation: DELETE_MESSAGE_MUTATION,
			variables: {
				messageId: this.props.message!._id,
				crudType: CrudEnum.DELETE
			}
		});
	};

	render() {
		const { message, isMine } = this.props;
		return (
			<ScMessage
				isMine={isMine}
				isClientDeleted={message.isClientDeleted}
				onContextMenu={this.handleContextMenu}
			>
				{message.isClientDeleted ? (
					<ScText>הודעה זו נמחקה</ScText>
				) : (
					<>
						<ScMetaData>{message.createdBy.displayName}</ScMetaData>
						{this.renderFile()}
						<ScEditable
							onChange={(e: any) =>
								this.setState({ messageBody: e.target.value })
							}
							onCancel={() =>
								this.setState({ messageBody: message.text, isEditable: false })
							}
							html={this.state.messageBody}
							submitOnEnter={true}
							disabled={!this.state.isEditable}
							innerRef={this.editableEl}
							onBlur={this.handleEditableBlur}
							isMine={isMine}
						/>
						<ScMetaData alignLeft={true}>
							{formatRelative(
								parseISO((message.createdAt as unknown) as string),
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
	}
}

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

	&[contenteditable='true'] {
		background: red;
	}
`;

const ScEditable = styled(({ isMine, ...rest }) => <Editable {...rest} />)<{
	isMine: boolean;
}>`
	padding: 0.5rem 0;

	&[contenteditable='true'] {
		background: #0268c7;
		padding: 0.7rem;
		border-radius: 0.3rem;
		margin: 0.3rem 0;
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

export default withApollo(
	connect(
		null,
		{ setMessageContextMenu }
	)(Message)
);
