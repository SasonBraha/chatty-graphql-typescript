import React, { Component, createRef, RefObject } from 'react';
import { IMessage } from '../../../types/interfaces';
import Message from './Message';
import styled from 'styled-components/macro';
import MessagesListLoader from './MessagesListLoader';
import { InfoBanner, Scrollable, Spinner } from '../../Shared';
import MessageContextMenu from './MessageContextMenu';
import { ApolloClient } from 'apollo-client';
import { withTranslation } from '../../Shared/Hoc';
import { afterRender } from '../../../utils';
import { MessageEdge, User } from '../../../__generated__/graphql';

interface IProps {
	currentUser?: User | null;
	loading: boolean;
	chatSlug: string;
	isFetching: boolean;
	isMoreMessagesToFetch: boolean;
	fetchOlderMessages: (cursor: string) => void;
	setIsMoreMessagesToFetch: (value: boolean) => void;
	client: ApolloClient<any>;
	t?: any;
	found: boolean;
	deletedMessages: { [key: string]: boolean };
	messages: MessageEdge[];
	storeMessages: boolean;
}

export interface IMessageCtxMenu {
	isOpen: boolean;
	message?: IMessage | null;
	position?: {
		x: number;
		y: number;
	};
	setEditable?: (value: boolean) => void;
	deleteMessage?: () => Promise<void>;
}

interface IState {
	messageCtxMenu: IMessageCtxMenu;
}

@withTranslation()
class MessagesList extends Component<IProps, IState> {
	private listEnd: RefObject<HTMLDivElement> = createRef();
	private messagesList: RefObject<HTMLDivElement> = createRef();
	private messageCtxMenuRef: RefObject<HTMLElement> = createRef();

	constructor(props: IProps) {
		super(props);
		this.state = {
			messageCtxMenu: {
				isOpen: false,
				message: null,
				position: {
					x: 0,
					y: 0
				}
			}
		};
	}

	getSnapshotBeforeUpdate(prevProps: IProps) {
		const { oldMessagesLength, newMessagesLength } = this.reduceUpdateData(
			prevProps,
			this.props
		);
		if (
			oldMessagesLength !== 0 &&
			newMessagesLength! - oldMessagesLength !== 1
		) {
			return (
				this.messagesList.current.scrollHeight -
				this.messagesList.current.scrollTop
			);
		}
		return null;
	}

	componentDidUpdate(prevProps: IProps, _: any, snapshot: number) {
		const { isRoomChanged, isMessagesUpdated } = this.reduceUpdateData(
			prevProps,
			this.props
		);

		if (isRoomChanged) {
			this.props.setIsMoreMessagesToFetch(true);
		}

		if (isMessagesUpdated) {
			if (snapshot !== null) {
				return (this.messagesList.current.scrollTop =
					this.messagesList.current.scrollHeight - snapshot);
			}

			afterRender(() => {
				this.listEnd.current.scrollIntoView();
			});
		}
	}

	onCtxTransitionEnd = () => {
		const ctxRef = this.messageCtxMenuRef.current!;
		ctxRef.style.transition = 'all 0.15s,transform 0.17s,left 0s,top 0s';
	};

	showMessageCtxMenu = (ctx: IMessageCtxMenu) => {
		if (ctx.isOpen && this.state.messageCtxMenu.isOpen) {
			const ctxRef = this.messageCtxMenuRef.current!;
			ctxRef.addEventListener('transitionend', this.onCtxTransitionEnd, {
				once: true
			});
			ctxRef.style.transition = 'all 0.15s,transform 0.17s';
		}

		this.setState({ messageCtxMenu: ctx });
	};

	handleReachTop = () => {
		const {
			isFetching,
			loading,
			fetchOlderMessages,
			isMoreMessagesToFetch,
			messages
		} = this.props;
		if (!isFetching && !loading && isMoreMessagesToFetch) {
			fetchOlderMessages(messages[0].cursor);
		}
	};

	handleScroll = () => {
		if (this.state.messageCtxMenu.isOpen) {
			this.closeMessageContextMenu();
		}
	};

	reduceUpdateData(prevProps: IProps, nextProps?: IProps) {
		return {
			oldMessagesLength: prevProps.messages.length,
			newMessagesLength: nextProps ? nextProps.messages.length : null,
			isMessagesUpdated: nextProps
				? prevProps.messages.length !== nextProps.messages.length
				: null,
			isRoomChanged: nextProps
				? prevProps.chatSlug !== nextProps.chatSlug
				: null
		};
	}

	closeMessageContextMenu = () => {
		this.setState({
			messageCtxMenu: { ...this.state.messageCtxMenu, isOpen: false }
		});
	};

	render() {
		const {
			currentUser,
			loading,
			isFetching,
			found,
			deletedMessages,
			storeMessages,
			messages
		} = this.props;

		return (
			<S.Scrollable
				ref={this.messagesList}
				whileScrolling={this.handleScroll}
				onReachTop={this.handleReachTop}
				offsetToCallback={100}
			>
				{!loading && found && !storeMessages && (
					<InfoBanner
						type='warning'
						text={this.props.t('chat.roomDoesNotSaveMessages')}
					/>
				)}

				{!loading && storeMessages && !messages.length && (
					<InfoBanner
						type='info'
						text={this.props.t('chat.noMessagesWereSent')}
					/>
				)}

				<Spinner
					size={35}
					spinnerColor='#0079ea'
					spinnerWidth={3}
					visible={isFetching}
				/>

				{loading
					? Array.from({ length: 20 }).map((_, i) => (
							<MessagesListLoader key={i} />
					  ))
					: messages.map(({ node }) => (
							// @ts-ignore
							<Message
								message={node}
								key={node._id}
								isDeleted={!!deletedMessages[node._id]}
								isMine={currentUser!.slug === node.createdBy.slug}
								setMessageCtxMenu={this.showMessageCtxMenu}
							/>
					  ))}
				<S.ListEnd ref={this.listEnd} />
				<MessageContextMenu
					ctx={this.state.messageCtxMenu}
					ref={this.messageCtxMenuRef}
					closeMenu={this.closeMessageContextMenu}
				/>
			</S.Scrollable>
		);
	}
}

const S: any = {};
S.Scrollable = styled(Scrollable)`
	flex: 1;
	background: ${props => props.theme.gray30};
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	padding: 1rem 1rem 0 1rem;

	.chatty__spinner {
		margin: 0.5rem auto 1rem auto;
	}

	.listEnd {
		padding-bottom: 1rem;
	}
`;

S.ListEnd = styled.div``;

export default MessagesList;
