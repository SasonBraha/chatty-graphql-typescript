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
}

interface IState {
	messages: IMessage[];
	isFetching: boolean;
}

class MessagesList extends Component<IProps, IState> {
	private listEnd: React.RefObject<any>;
	private unsubscribe: any;
	constructor(props: IProps) {
		super(props);
		this.init();
		this.state = {
			messages: [],
			isFetching: false
		};
		this.listEnd = React.createRef();
	}

	private init() {
		console.log(this.props);
		this.unsubscribe = this.props.subscribeToNewMessages(this.props.chatSlug);
	}

	private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const shouldFetchThreshold = 250;
		const { isFetching, isMoreMessagesToFetch } = this.props;
		if (
			e.currentTarget.scrollTop < shouldFetchThreshold &&
			!isFetching &&
			isMoreMessagesToFetch
		) {
			this.props.fetchOlderMessages(
				this.props.chatSlug,
				this.props.data.chat.messages[0]._id
			);
		}
	};

	componentDidUpdate(prevProps: IProps) {
		const { data: oldData } = prevProps;
		const { data: newData } = this.props;

		// Handle Room Change
		const isNewRoom = prevProps.chatSlug !== this.props.chatSlug;
		if (isNewRoom) {
			this.unsubscribe();
			this.unsubscribe = this.props.subscribeToNewMessages(this.props.chatSlug);
		}

		// Handle Message Added
		const isNewMessage =
			(!oldData.chat && newData.chat) ||
			oldData.chat.messages.length !== newData.chat.messages.length ||
			isNewRoom;
		if (isNewMessage) {
			this.listEnd.current.scrollIntoView();
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const {
			currentUser,
			loading,
			data: { chat }
		} = this.props;

		return (
			<ScMessagesList onScroll={this.handleScroll}>
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

const mapStateToProps = ({ currentUser }: IReducerState) => ({ currentUser });
export default connect(
	mapStateToProps,
	null
)(MessagesList);
