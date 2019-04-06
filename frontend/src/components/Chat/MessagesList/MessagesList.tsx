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
	data: {
		chat: {
			messages: IMessage[];
		};
	};
	subscribeToNewMessages: (chatSlug: string) => void;
}

interface IState {
	messages: IMessage[];
	unsubscribe: any;
}

class MessagesList extends Component<IProps, IState> {
	private listEnd: React.RefObject<any>;
	private unsubscribe: any;
	constructor(props: IProps) {
		super(props);
		this.init();
		this.state = {
			messages: [],
			unsubscribe: null
		};
		this.listEnd = React.createRef();
	}

	private init() {
		this.unsubscribe = this.props.subscribeToNewMessages(this.props.chatSlug);
	}

	componentDidUpdate(prevProps: IProps) {
		const { data: oldData } = prevProps;
		const { data: newData } = this.props;

		// Handle Room Change
		if (prevProps.chatSlug !== this.props.chatSlug) {
			this.unsubscribe();
			this.unsubscribe = this.props.subscribeToNewMessages(this.props.chatSlug);
		}

		// Handle Message Added
		const isNewMessage =
			(!oldData.chat && newData.chat) ||
			oldData.chat.messages.length !== newData.chat.messages.length;
		if (isNewMessage) {
			this.listEnd.current.scrollIntoView({ behavior: 'smooth' });
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
			<ScMessagesList>
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
