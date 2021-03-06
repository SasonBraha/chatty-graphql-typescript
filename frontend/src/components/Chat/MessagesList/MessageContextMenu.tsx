import React from 'react';
import { Dropdown, ListItem } from '../../Shared';
import { IMessageCtxMenu } from './MessagesList';
import i18n from '../../../locale';

interface IProps {
	ctx: IMessageCtxMenu;
	closeMenu: () => void;
}

const contextMenuOptions = (props: IProps) => [
	{
		icon: 'icon-bin2',
		text: i18n.t('chat.messageCtxMenu.delete'),
		async onClick() {
			await props.ctx.deleteMessage!();
		}
	},
	{
		icon: 'icon-pencil',
		text: i18n.t('chat.messageCtxMenu.edit'),
		onClick() {
			typeof props.ctx.setEditable === 'function' &&
				props.ctx.setEditable(true);
		}
	}
];

const MessageContextMenu = React.forwardRef(
	(props: IProps, ref: React.Ref<any>) => (
		<Dropdown
			resetDropdown={props.closeMenu}
			isOpen={props.ctx.isOpen}
			left={props.ctx.position!.x}
			top={props.ctx.position!.y}
			ref={ref}
		>
			<ul>
				{contextMenuOptions(props).map((option, i) => (
					<ListItem {...option} key={i} withRipple>
						{option.text}
					</ListItem>
				))}
			</ul>
		</Dropdown>
	)
);

export default MessageContextMenu;
