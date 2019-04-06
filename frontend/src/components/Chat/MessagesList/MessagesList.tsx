import React, { Component } from 'react';
import { IMessage, IUser } from '../../../models';
import Message from './Message';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import styled from 'styled-components/macro';

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
	fetchOlderMessages: (chatSlug: string, beforeMessageId: string) => void;
	setIsMoreMessagesToFetch: (value: boolean) => void;
}

interface IState {
	messages: IMessage[];
}

@connect(({ currentUser }: IReducerState) => ({ currentUser }))
class MessagesList extends Component<IProps, IState> {
	private unsubscribe: any;
	private listEnd: React.RefObject<any> = React.createRef();
	private messagesList: React.RefObject<any> = React.createRef();
	private shouldFetchTreshold: number = 250;
	constructor(props: IProps) {
		super(props);
		this.init();
		this.state = {
			messages: []
		};
	}

	private init() {
		this.unsubscribe = this.props.subscribeToNewMessages(this.props.chatSlug);
	}

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

	shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
		const { isMessagesUpdated, isRoomChanged } = this.extractRequiredData(
			this.props,
			nextProps
		);
		return isMessagesUpdated! || isRoomChanged!;
	}

	componentDidUpdate(prevProps: IProps, prevState: IState, snapshot: number) {
		const { isRoomChanged, isMessagesUpdated } = this.extractRequiredData(
			prevProps,
			this.props
		);

		// Handle Room Change
		if (isRoomChanged) {
			this.unsubscribe();
			this.props.setIsMoreMessagesToFetch(true);
			this.unsubscribe = this.props.subscribeToNewMessages(this.props.chatSlug);
		}

		// Handle Message Added
		if (isMessagesUpdated) {
			if (snapshot !== null) {
				return (this.messagesList.current.scrollTop =
					this.messagesList.current.scrollHeight - snapshot);
			}
			this.listEnd.current.scrollIntoView();
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { isFetching, isMoreMessagesToFetch } = this.props;
		if (
			e.currentTarget.scrollTop < this.shouldFetchTreshold &&
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
