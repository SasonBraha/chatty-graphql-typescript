import React, { Component } from 'react';
import { IMessage, IUser } from '../../../models';
import Message from './Message';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import styled from 'styled-components/macro';
import MessagesListLoader from './MessagesListLoader';
import { Spinner } from '../../Shared';
import MessageContextMenu from './MessageContextMenu';
import { setMessageContextMenu } from '../../../redux/actions';
import { IMessageContextMenu } from '../../../redux/interfaces';

interface IProps {
	currentUser?: IUser | null;
	loading: boolean;
	chatSlug: string;
	isFetching: boolean;
	isMoreMessagesToFetch: boolean;
	shouldComponentUpdateIndicator: number;
	data: {
		chat: {
			messages: IMessage[];
		};
	};
	subscribeToNewMessages: (chatSlug: string) => void;
	subscribeToFileUpload: (chatSlug: string) => void;
	subscribeToMessageDeleted: (chatSlug: string) => void;
	fetchOlderMessages: (chatSlug: string, beforeMessageId: string) => void;
	setIsMoreMessagesToFetch: (value: boolean) => void;
	messageContextMenu?: IMessageContextMenu;
	setMessageContextMenu?: typeof setMessageContextMenu;
	refetch: () => void;
}

const mapStateToProps = ({
	currentUser,
	messageContextMenu
}: IReducerState) => ({ currentUser, messageContextMenu });
@connect(
	mapStateToProps,
	{ setMessageContextMenu }
)
class MessagesList extends Component<IProps> {
	private unsubscribeFromNewMessages: any;
	private unsubscribeFromFileUploaded: any;
	private unsubscribeFromMessageDeleted: any;
	private listEnd: React.RefObject<any> = React.createRef();
	private messagesList: React.RefObject<any> = React.createRef();
	private shouldFetchThreshold: number = 750;
	constructor(props: IProps) {
		super(props);
		this.init();
	}

	private init() {
		this.unsubscribeFromNewMessages = this.props.subscribeToNewMessages(
			this.props.chatSlug
		);
		this.unsubscribeFromFileUploaded = this.props.subscribeToFileUpload(
			this.props.chatSlug
		);
		this.unsubscribeFromMessageDeleted = this.props.subscribeToMessageDeleted(
			this.props.chatSlug
		);
	}

	getSnapshotBeforeUpdate(prevProps: IProps) {
		const { oldMessagesLength, newMessagesLength } = this.extractRequiredData(
			prevProps,
			this.props
		);
		if (newMessagesLength! - oldMessagesLength !== 1) {
			return (
				this.messagesList.current.scrollHeight -
				this.messagesList.current.scrollTop
			);
		}
		return null;
	}

	shouldComponentUpdate(nextProps: IProps): boolean {
		const { isMessagesUpdated, isRoomChanged } = this.extractRequiredData(
			this.props,
			nextProps
		);
		return (
			isMessagesUpdated! ||
			isRoomChanged! ||
			this.props.isMoreMessagesToFetch !== nextProps.isMoreMessagesToFetch ||
			this.props.shouldComponentUpdateIndicator !==
				nextProps.shouldComponentUpdateIndicator
		);
	}

	componentDidUpdate(prevProps: IProps, _: any, snapshot: number) {
		const { isRoomChanged, isMessagesUpdated } = this.extractRequiredData(
			prevProps,
			this.props
		);

		if (isRoomChanged) {
			this.unsubscribeFromNewMessages();
			this.unsubscribeFromFileUploaded();
			this.unsubscribeFromMessageDeleted();
			this.props.setIsMoreMessagesToFetch(true);
			this.unsubscribeFromNewMessages = this.props.subscribeToNewMessages(
				this.props.chatSlug
			);
			this.unsubscribeFromFileUploaded = this.props.subscribeToFileUpload(
				this.props.chatSlug
			);
			this.unsubscribeFromMessageDeleted = this.props.subscribeToMessageDeleted(
				this.props.chatSlug
			);
			this.props.refetch();
		}

		if (isMessagesUpdated) {
			if (snapshot !== null) {
				return (this.messagesList.current.scrollTop =
					this.messagesList.current.scrollHeight - snapshot);
			}
			this.listEnd.current.scrollIntoView();
		}
	}

	componentWillUnmount() {
		this.unsubscribeFromNewMessages();
		this.unsubscribeFromFileUploaded();
		this.unsubscribeFromMessageDeleted();
	}

	private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { isFetching, isMoreMessagesToFetch } = this.props;
		if (
			e.currentTarget.scrollTop < this.shouldFetchThreshold &&
			!isFetching &&
			isMoreMessagesToFetch &&
			this.props.data.chat.messages.length
		) {
			this.props.fetchOlderMessages(
				this.props.chatSlug,
				this.props.data.chat.messages[0]._id
			);
		}

		if (this.props.messageContextMenu!.isOpen) {
			this.props.setMessageContextMenu!({ isOpen: false });
		}
	};

	private extractRequiredData(prevProps: IProps, nextProps?: IProps) {
		return {
			oldMessagesLength: prevProps.data.chat.messages.length,
			newMessagesLength: nextProps ? nextProps.data.chat.messages.length : null,
			isMessagesUpdated: nextProps
				? prevProps.data.chat.messages.length !==
				  nextProps.data.chat.messages.length
				: null,
			isRoomChanged: nextProps
				? prevProps.chatSlug !== nextProps.chatSlug
				: null
		};
	}

	render() {
		const {
			currentUser,
			loading,
			isMoreMessagesToFetch,
			data: { chat }
		} = this.props;

		return (
			<ScMessagesList ref={this.messagesList} onScroll={this.handleScroll}>
				<Spinner
					size={35}
					spinnerColor='#0079ea'
					spinnerWidth={3}
					visible={isMoreMessagesToFetch && !loading}
				/>
				{loading
					? Array.from({ length: 20 }).map((_, i) => (
							<MessagesListLoader key={i} />
					  ))
					: chat.messages.map(message => (
							<Message
								message={message}
								key={message._id}
								isMine={currentUser!.slug === message.createdBy.slug}
							/>
					  ))}
				<div ref={this.listEnd} className='listEnd' />
				<MessageContextMenu />
			</ScMessagesList>
		);
	}
}

const ScMessagesList = styled.div`
	flex: 1;
	background: ${props => props.theme.gray30};
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	padding: 1rem;

	.chatty__spinner {
		margin: 0.5rem auto 1rem auto;
	}
`;

export default MessagesList;
