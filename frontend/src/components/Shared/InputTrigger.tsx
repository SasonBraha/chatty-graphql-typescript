import React, { ReactNode, useState } from 'react';

interface ITriggerData {
	start: number;
	value: string;
}

interface IProps {
	onStart?: (mentionData: ITriggerData) => any;
	onType?: (mentionData: ITriggerData) => any;
	onCancel?: (mentionData: ITriggerData) => any;
	typeCallbackDebounceRate?: number;
	triggerSymbol: '@' | '#' | '$';
	children: ReactNode;
	className?: string;
}

const supportedTriggerSymbols: { [key: string]: number } = {
	'@': 50,
	'#': 51,
	$: 53
};

let onTypeCbTimeout: ReturnType<typeof setTimeout>;
const handleKeyUp = (
	e: React.KeyboardEvent<HTMLInputElement>,
	props: IProps
) => {
	const SPACE_KEY_CODE = 32;
	const BACKSPACE_KEY_CODE = 8;
	const TRIGGER_SYMBOL_KEY_CODE = supportedTriggerSymbols[props.triggerSymbol];
	const eventTarget = e.target as HTMLInputElement;
	console.log(eventTarget.selectionStart);
};

const InputTrigger: React.FC<IProps> = props => {
	const [isTriggered, setIsTriggred] = useState(false);
	const {
		onStart,
		onType,
		onCancel,
		typeCallbackDebounceRate,
		triggerSymbol,
		children,
		...rest
	} = props;

	return (
		<div
			onKeyUp={e =>
				handleKeyUp(e as React.KeyboardEvent<HTMLInputElement>, props)
			}
			{...rest}
			tabIndex={-1}
		>
			{children}
		</div>
	);
};

export default InputTrigger;
