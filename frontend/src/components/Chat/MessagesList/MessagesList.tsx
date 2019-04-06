import React, { Component } from 'react';
import { IMessage, IUser } from '../../../models';
import Message from './Message';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import styled from 'styled-components/macro';

interface IProps {
	currentUser?: IUser | null;
	loading: boolean;
	data: {
		chat: {
			messages: IMessage[];
		};
	};
	subscribeToNewMessages: () => void;
}

interface IState {
	messages: IMessage[];
}

class MessagesList extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.init();
		this.state = {
			messages: []
		};
	}

	private init() {
		this.props.subscribeToNewMessages();
	}

	componentDidUpdate(prevProps: IProps) {}

	componentWillUnmount() {}

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
	padding: 1rem 1rem 2rem 1rem;
`;

const mapStateToProps = ({ currentUser }: IReducerState) => ({ currentUser });
export default connect(
	mapStateToProps,
	null
)(MessagesList);
