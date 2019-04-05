import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components/macro';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { IMessage, IUser } from '../../models';
import Message from './Message';
import { connect } from 'react-redux';
import { IReducerState } from '../../redux/reducers';

const MESSAGES_LIST_QUERY = gql`
	query($chatSlug: String!) {
		chat(chatSlug: $chatSlug) {
			messages {
				_id
				text
				createdBy {
					displayName
					avatar
					slug
				}
				file {
					path
					dimensions {
						height
						width
					}
				}
				createdAt
			}
		}
	}
`;

interface IMatchParams {
	chatSlug?: string;
}
interface IProps extends RouteComponentProps<IMatchParams> {
	currentUser: IUser | null;
}

class MessagesList extends Component<IProps> {
	constructor(props: IProps) {
		super(props);
		this.init();
	}

	private init() {}

	componentDidUpdate(prevProps: IProps) {}

	render() {
		const { chatSlug } = this.props.match.params;
		return (
			<ScMessagesList>
				<Query query={MESSAGES_LIST_QUERY} variables={{ chatSlug }}>
					{({ loading, data }) => {
						if (loading) return <div>Loadin</div>;
						return data.chat.messages.map((message: IMessage) => (
							<Message
								message={message}
								key={message._id}
								isMine={this.props.currentUser!.slug === message.createdBy.slug}
							/>
						));
					}}
				</Query>
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
	padding: 0 1rem;
`;

const mapStateToProps = ({ currentUser }: IReducerState) => ({ currentUser });
export default connect(
	mapStateToProps,
	null
)(MessagesList);
