import React, { ReactNode, useState } from 'react';

interface ITriggerData {
	start: number;
	value: string | null;
}

interface IProps {
	onStart?: (mentionData: ITriggerData) => any;
	onType?: (mentionData: ITriggerData) => any;
	onCancel?: () => any;
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

let onTypeTimeout: ReturnType<typeof setTimeout>;
const InputTrigger: React.FC<IProps> = props => {
	const [isTriggered, setIsTriggered] = useState(false);
	const [triggerStartIndex, setTriggerStartIndex] = useState(0);
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
			onKeyUp={async e => {
				const SPACE_KEY_CODE = 32;
				const BACKSPACE_KEY_CODE = 8;
				const TRIGGER_SYMBOL_KEY_CODE =
					supportedTriggerSymbols[props.triggerSymbol];
				const eventTarget = e.target as HTMLInputElement;
				const { selectionStart, value } = eventTarget;
				const { which } = e;

				clearTimeout(onTypeTimeout);
				if (!isTriggered) {
					if (which === TRIGGER_SYMBOL_KEY_CODE) {
						setTriggerStartIndex(selectionStart as number);
						setIsTriggered(true);
						typeof props.onStart === 'function' &&
							props.onStart({ start: selectionStart!, value: null });
					}
				} else {
					if (
						which === BACKSPACE_KEY_CODE &&
						selectionStart! < triggerStartIndex
					) {
						setIsTriggered(false);
						typeof props.onCancel === 'function' && props.onCancel();
						return;
					}

					if (which === SPACE_KEY_CODE) {
						setIsTriggered(false);
						typeof props.onCancel === 'function' && props.onCancel();
						return;
					}

					onTypeTimeout = setTimeout(() => {
						typeof props.onType === 'function' &&
							props.onType({
								value: value.slice(triggerStartIndex),
								start: triggerStartIndex
							});
					}, props.typeCallbackDebounceRate || 0);
				}
			}}
			{...rest}
			tabIndex={-1}
		>
			{children}
		</div>
	);
};

export default InputTrigger;
