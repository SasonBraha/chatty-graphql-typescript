import React, { Component } from 'react';
import { IMessage } from '../../../types/interfaces';
import Message from './Message';
import styled from 'styled-components/macro';
import MessagesListLoader from './MessagesListLoader';
import { InfoBanner, Spinner } from '../../Shared';
import MessageContextMenu from './MessageContextMenu';
import { ApolloClient } from 'apollo-client';
import { withTranslation } from '../../Shared/Hoc';
import { afterRender } from '../../../utils';
import { User } from '../../../__generated__/graphql';

interface IProps {
	currentUser?: User | null;
	loading: boolean;
	chatSlug: string;
	isFetching: boolean;
	isMoreMessagesToFetch: boolean;
	data: {
		chat: {
			messages: any[];
			storeMessages: boolean;
		};
	};
	subscribeToUpdates: (chatSlug: string) => void;
	fetchOlderMessages: (chatSlug: string, beforeMessageId: string) => void;
	setIsMoreMessagesToFetch: (value: boolean) => void;
	updateQuery: () => void;
	refetch: () => void;
	client: ApolloClient<any>;
	t?: any;
	found: boolean;
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
	private unsubscribeFromUpdates: any;
	private listEnd: React.RefObject<any> = React.createRef();
	private messagesList: React.RefObject<any> = React.createRef();
	private messageCtxMenuRef: React.RefObject<HTMLElement> = React.createRef();
	private shouldFetchThreshold: number = 250;

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

	componentDidMount() {
		this.unsubscribeFromUpdates = this.props.subscribeToUpdates(
			this.props.chatSlug
		);
	}

	getSnapshotBeforeUpdate(prevProps: IProps) {
		const { oldMessagesLength, newMessagesLength } = this.extractRequiredData(
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

	shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
		const { isMessagesUpdated, isRoomChanged } = this.extractRequiredData(
			this.props,
			nextProps
		);

		return (
			isMessagesUpdated! ||
			isRoomChanged! ||
			this.props.isMoreMessagesToFetch !== nextProps.isMoreMessagesToFetch ||
			this.props.updateQuery !== nextProps.updateQuery ||
			this.state.messageCtxMenu.isOpen !== nextState.messageCtxMenu.isOpen ||
			this.state.messageCtxMenu.position!.x !==
				nextState.messageCtxMenu.position!.x ||
			this.state.messageCtxMenu.position!.y !==
				nextState.messageCtxMenu.position!.y
		);
	}

	componentDidUpdate(prevProps: IProps, _: any, snapshot: number) {
		const { isRoomChanged, isMessagesUpdated } = this.extractRequiredData(
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

	componentWillUnmount() {
		this.unsubscribeFromUpdates();
	}

	private onCtxTransitionEnd = () => {
		const ctxRef = this.messageCtxMenuRef.current!;
		ctxRef.style.transition = 'all 0.15s,transform 0.17s,left 0s,top 0s';
	};

	private showMessageCtxMenu = (ctx: IMessageCtxMenu) => {
		if (ctx.isOpen && this.state.messageCtxMenu.isOpen) {
			const ctxRef = this.messageCtxMenuRef.current!;
			ctxRef.addEventListener('transitionend', this.onCtxTransitionEnd, {
				once: true
			});
			ctxRef.style.transition = 'all 0.15s,transform 0.17s';
		}

		this.setState({ messageCtxMenu: ctx });
	};

	private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { isFetching, isMoreMessagesToFetch } = this.props;
		if (
			e.currentTarget.scrollTop < this.shouldFetchThreshold &&
			!isFetching &&
			isMoreMessagesToFetch &&
			this.props.data.chat.messages.length &&
			!this.props.loading
		) {
			this.props.fetchOlderMessages(
				this.props.chatSlug,
				this.props.data.chat.messages[0]._id
			);
		}

		if (this.state.messageCtxMenu.isOpen) {
			this.setState({
				messageCtxMenu: { ...this.state.messageCtxMenu, isOpen: false }
			});
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
			isFetching,
			found,
			data: { chat }
		} = this.props;

		return (
			<ScMessagesList ref={this.messagesList} onScroll={this.handleScroll}>
				{!loading && found && !chat.storeMessages && (
					<InfoBanner
						type='warning'
						text={this.props.t('chat.roomDoesNotSaveMessages')}
					/>
				)}

				{!loading && chat.storeMessages && !chat.messages.length && (
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
					: chat.messages.map(({ node }) => (
							// @ts-ignore
							<Message
								message={node}
								key={node._id}
								isMine={currentUser!.slug === node.createdBy.slug}
								setMessageCtxMenu={this.showMessageCtxMenu}
							/>
					  ))}
				<div ref={this.listEnd} className='listEnd' />
				<MessageContextMenu
					ctx={this.state.messageCtxMenu}
					ref={this.messageCtxMenuRef}
					closeMenu={() =>
						this.setState({
							messageCtxMenu: { ...this.state.messageCtxMenu, isOpen: false }
						})
					}
				/>
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
	padding: 1rem 1rem 0 1rem;

	.chatty__spinner {
		margin: 0.5rem auto 1rem auto;
	}

	.listEnd {
		padding-bottom: 1rem;
	}
`;

export default MessagesList;
