import React from 'react';
import ContentEditable from 'react-contenteditable';

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
	innerRef?: React.RefObject<any>;
}

const handleKeyDown = (e: React.KeyboardEvent, props: IProps) => {
	const isEnterPressed = e.which === 13;
	const isEscapePressed = e.which === 27;

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
};

const Editable: React.FC<IProps> = props => {
	const { onCancel, submitOnEnter, ...defaultEditableProps } = props;
	return (
		<div
			className='Editable'
			onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, props)}
		>
			<ContentEditable {...defaultEditableProps} />
		</div>
	);
};

export default Editable;
