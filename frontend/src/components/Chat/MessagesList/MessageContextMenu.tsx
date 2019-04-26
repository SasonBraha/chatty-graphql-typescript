import React from 'react';
import { Dropdown, ListItem } from '../../Shared';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import { setMessageContextMenu } from '../../../redux/actions';
import { IMessageContextMenu } from '../../../redux/interfaces';

interface IProps {
	setMessageContextMenu: typeof setMessageContextMenu;
	messageContextMenu: IMessageContextMenu;
}

const contextMenuOptions = [
	{
		icon: 'icon-bin2',
		text: 'מחק',
		onClick() {}
	},
	{
		icon: 'icon-pencil',
		text: 'ערוך',
		onClick() {}
	}
];

const MessageContextMenu: React.FC<IProps> = props => (
	<Dropdown
		resetDropdown={() => props.setMessageContextMenu({ isOpen: false })}
		isOpen={props.messageContextMenu.isOpen}
		left={props.messageContextMenu.position!.x}
		top={props.messageContextMenu.position!.y}
		width={10}
	>
		<ul>
			{contextMenuOptions.map((option, i) => (
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
export default connect(
	mapStateToProps,
	{ setMessageContextMenu }
)(MessageContextMenu);
