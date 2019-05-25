import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ListItem from './ListItem';

export interface IListItem {
	icon?: string;
	image?: string;
	linkTo?: string;
	hoverBackground?: string;
	color: string;
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
		const ARROW_UP_KEYCODE = 38;
		const ARROW_DOWN_KEYCODE = 40;
		const ENTER_KEY_CODE = 13;

		switch (e.which) {
			case ARROW_UP_KEYCODE:
				if (selectedIndex !== 0) setSelectedIndex(selectedIndex - 1);
				break;

			case ARROW_DOWN_KEYCODE:
				if (selectedIndex < props.items.length - 1)
					setSelectedIndex(selectedIndex + 1);
				break;

			case ENTER_KEY_CODE:
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
			tabIndex={0}
		>
			{props.items.map((item, i) => (
				<ListItem key={i} {...item} isSelected={i === selectedIndex} />
			))}
		</ScList>
	);
};

const ScList = styled.ul`
	outline: none;
`;

export default List;
