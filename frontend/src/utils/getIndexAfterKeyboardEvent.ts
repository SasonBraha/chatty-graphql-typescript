import { KeyCodeEnum } from '../types/enums';
import * as React from 'react';

const getIndexAfterKeyboardEvent = (
	e: React.KeyboardEvent,
	currentIndex: number,
	itemsLength: number,
	cb: (index: number) => any | void,
	enterCb?: () => any | void
) => {
	switch (e.which) {
		case KeyCodeEnum.ARROW_UP:
			currentIndex === 0 ? cb(itemsLength - 1) : cb(currentIndex - 1);
			break;

		case KeyCodeEnum.ARROW_DOWN:
			currentIndex === itemsLength - 1 ? cb(0) : cb(currentIndex + 1);
			break;

		case KeyCodeEnum.ENTER:
			typeof enterCb === 'function' && enterCb();
	}
};

export default getIndexAfterKeyboardEvent;
