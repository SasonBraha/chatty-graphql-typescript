import React from 'react';
import { Dropdown, ListItem } from '../../Shared';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import { setMessageContextMenu } from '../../../redux/actions';
import { IMessageContextMenu } from '../../../redux/interfaces';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';

interface IProps {
	setMessageContextMenu: typeof setMessageContextMenu;
	messageContextMenu: IMessageContextMenu;
	client?: ApolloClient<any>;
}

const contextMenuOptions = (props: IProps) => [
	{
		icon: 'icon-bin2',
		text: 'מחק',
		async onClick() {
			await props.messageContextMenu.deleteMessage!();
		}
	},
	{
		icon: 'icon-pencil',
		text: 'ערוך',
		onClick() {
			typeof props.messageContextMenu.setEditable === 'function' &&
				props.messageContextMenu.setEditable(true);
		}
	}
];

const MessageContextMenu: React.FC<IProps> = props => (
	<Dropdown
		resetDropdown={() => props.setMessageContextMenu({ isOpen: false })}
		isOpen={props.messageContextMenu.isOpen}
		left={props.messageContextMenu.position!.x}
		top={props.messageContextMenu.position!.y}
	>
		<ul>
			{contextMenuOptions(props).map((option, i) => (
				<ListItem {...option} key={i} withRipple>
					{option.text}
				</ListItem>
			))}
		</ul>
	</Dropdown>
);

const mapStateToProps = ({ messageContextMenu }: IReducerState) => ({
	messageContextMenu
});
export default withApollo(
	connect(
		mapStateToProps,
		{ setMessageContextMenu }
	)(MessageContextMenu)
);
