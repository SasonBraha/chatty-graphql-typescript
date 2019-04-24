import React, { Component } from 'react';
import { IMessage, IUser } from '../../../models';
import Message from './Message';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import styled from 'styled-components/macro';
import { CircleLoader, LineLoader } from '../../Shared/Loaders';

interface IProps {
	currentUser?: IUser | null;
	loading: boolean;
	chatSlug: string;
	isFetching: boolean;
	isMoreMessagesToFetch: boolean;
	data: {
		chat: {
			messages: IMessage[];
		};
	};
	subscribeToNewMessages: (chatSlug: string) => void;
	subscribeToFileUpload: (chatSlug: string) => void;
	fetchOlderMessages: (chatSlug: string, beforeMessageId: string) => void;
	setIsMoreMessagesToFetch: (value: boolean) => void;
	refetch: () => void;
}

@connect(({ currentUser }: IReducerState) => ({ currentUser }))
class MessagesList extends Component<IProps> {
	private unsubscribeFromNewMessages: any;
	private unsubscribeFromFileUploaded: any;
	private listEnd: React.RefObject<any> = React.createRef();
	private messagesList: React.RefObject<any> = React.createRef();
	private shouldFetchThreshold: number = 250;
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
		return isMessagesUpdated! || isRoomChanged!;
	}

	componentDidUpdate(prevProps: IProps, _: any, snapshot: number) {
		const { isRoomChanged, isMessagesUpdated } = this.extractRequiredData(
			prevProps,
			this.props
		);

		if (isRoomChanged) {
			this.unsubscribeFromNewMessages();
			this.unsubscribeFromFileUploaded();
			this.props.setIsMoreMessagesToFetch(true);
			this.unsubscribeFromNewMessages = this.props.subscribeToNewMessages(
				this.props.chatSlug
			);
			this.unsubscribeFromFileUploaded = this.props.subscribeToFileUpload(
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
			data: { chat }
		} = this.props;

		return (
			<ScMessagesList ref={this.messagesList} onScroll={this.handleScroll}>
				{loading ? (
					<div>Loading</div>
				) : (
					chat.messages.map(message => (
						<Message
							message={message}
							key={message._id}
							isMine={currentUser!.slug === message.createdBy.slug}
						/>
					))
				)}
				<div ref={this.listEnd} className='listEnd' />
				<CircleLoader />
				<LineLoader />
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
`;

export default MessagesList;
