import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ListItem from './ListItem';
import { KeyCodeEnum } from '../../../types/enums';

export interface IListItem {
	icon?: string;
	image?: string;
	linkTo?: string;
	hoverBackground?: string;
	color?: string;
	onClick?: () => void;
	withRipple?: boolean;
	text?: string;
	isSelected?: boolean;
	children?: ReactNode;
}

interface IProps {
	items: IListItem[];
	onSelect?: (text: string) => any | void;
	withKeyboardNavigation?: boolean;
	focusWhenVisible?: boolean;
}

const handleKeyDown = (
	e: React.KeyboardEvent,
	props: IProps,
	selectedIndex: number,
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
) => {
	if (props.withKeyboardNavigation) {
		switch (e.which) {
			case KeyCodeEnum.ARROW_UP:
				if (selectedIndex !== 0) setSelectedIndex(selectedIndex - 1);
				break;

			case KeyCodeEnum.ARROW_DOWN:
				setSelectedIndex(selectedIndex + 1);
				break;

			case KeyCodeEnum.ENTER:
				typeof props.onSelect === 'function' &&
					props.onSelect(props.items[selectedIndex].text as string);
				break;
		}
	}
};

const List: React.FC<IProps> = props => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const listRef: any = useRef(null);

	useEffect(() => {
		if (props.focusWhenVisible) {
			listRef.current.focus();
		}
	}, []);

	return (
		<ScList
			onKeyDown={e => handleKeyDown(e, props, selectedIndex, setSelectedIndex)}
			ref={listRef}
			tabIndex={-1}
		>
			{props.items.map((item, i) => (
				<ListItem
					key={i}
					{...item}
					isSelected={
						props.withKeyboardNavigation &&
						selectedIndex % props.items.length === i
					}
					onClick={
						item.onClick
							? item.onClick
							: () =>
									typeof props.onSelect === 'function' &&
									props.onSelect(item.text as string)
					}
				/>
			))}
		</ScList>
	);
};

const ScList = styled.ul`
	outline: none;
`;

export default List;
