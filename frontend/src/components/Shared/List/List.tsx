import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ListItem from './ListItem';
import { getIndexAfterKeyboardEvent } from '../../../utils';

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
	listName?: string;
}

const handleKeyDown = (
	e: React.KeyboardEvent,
	props: IProps,
	selectedIndex: number,
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
) => {
	if (props.withKeyboardNavigation) {
		getIndexAfterKeyboardEvent(
			e,
			selectedIndex,
			props.items.length,
			setSelectedIndex,
			() => {
				typeof props.onSelect === 'function' &&
					props.onSelect(props.items[selectedIndex].text as string);
			}
		);
	}
};

const List: React.FC<IProps> = props => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const listRef: any = useRef(null);

	useEffect(() => {
		if (props.focusWhenVisible && props.items.length) {
			listRef.current.focus();
		}
	}, [props.focusWhenVisible, props.items]);

	useEffect(() => {}, []);

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
					isSelected={props.withKeyboardNavigation && selectedIndex === i}
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
