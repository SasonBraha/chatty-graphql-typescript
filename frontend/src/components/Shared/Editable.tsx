import React, { useCallback, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { KeyCodeEnum } from '../../types/enums';
import { placeCaretAtEnd } from '../../utils';

interface IProps {
	onCancel?: (...args: any[]) => any;
	submitOnEnter?: boolean;
	html: string;
	onChange?: (...args: any[]) => any;
	onBlur?: (...args: any[]) => any;
	onKeyDown?: (...args: any[]) => any;
	disabled?: boolean;
	tagName?: string;
	className?: string;
	style?: {};
}

const Editable: React.FC<IProps> = props => {
	const { onCancel, submitOnEnter, ...defaultEditableProps } = props;
	const editableRef: React.RefObject<any> = useRef();

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		const isEnterPressed = e.key === KeyCodeEnum.ENTER;
		const isEscapePressed = e.key === KeyCodeEnum.ESCAPE;

		switch (true) {
			case isEnterPressed &&
				props.submitOnEnter &&
				typeof props.onBlur === 'function':
				e.preventDefault();
				props.onBlur!();
				break;

			case isEscapePressed && typeof props.onCancel === 'function':
				e.preventDefault();
				props.onCancel!();
				break;
		}
	}, []);

	useEffect(() => {
		placeCaretAtEnd(editableRef.current);
	}, []);

	return (
		<div className='Editable' onKeyDown={handleKeyDown}>
			{/*
 // @ts-ignore */}
			<ContentEditable innerRef={editableRef} {...defaultEditableProps} />
		</div>
	);
};

export default Editable;
