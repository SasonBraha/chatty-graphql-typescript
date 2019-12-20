import React, { ReactNode, useCallback, useState } from 'react';
import { KeyCodeEnum } from '../../types/enums';

interface ITriggerData {
	start: number;
	value: string | null;
}

interface IProps {
	onStart?: (mentionData: ITriggerData) => any;
	onType?: (mentionData: ITriggerData) => any;
	onCancel?: () => any;
	typeCallbackDebounce?: number;
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
		typeCallbackDebounce,
		triggerSymbol,
		children,
		...rest
	} = props;

	const handleKeyUp = useCallback(
		async (e: React.KeyboardEvent) => {
			const TRIGGER_SYMBOL_KEY_CODE =
				supportedTriggerSymbols[props.triggerSymbol];
			const eventTarget = e.target as HTMLInputElement;
			const { selectionStart, value } = eventTarget;
			const { which, shiftKey, key } = e;

			clearTimeout(onTypeTimeout);

			if (!isTriggered) {
				if (which === TRIGGER_SYMBOL_KEY_CODE && shiftKey) {
					setTriggerStartIndex(selectionStart as number);
					setIsTriggered(true);
					typeof props.onStart === 'function' &&
						props.onStart({ start: selectionStart!, value: null });
				}
			} else {
				if (
					(key === KeyCodeEnum.BACKSPACE &&
						selectionStart! < triggerStartIndex) ||
					key === KeyCodeEnum.SPACE ||
					key === KeyCodeEnum.ENTER
				) {
					setIsTriggered(false);
					typeof props.onCancel === 'function' && props.onCancel();
					return;
				}

				onTypeTimeout = setTimeout(() => {
					typeof props.onType === 'function' &&
						isTriggered &&
						props.onType({
							value: value.slice(triggerStartIndex),
							start: triggerStartIndex
						});
				}, props.typeCallbackDebounce || 0);
			}
		},
		[isTriggered, triggerStartIndex]
	);

	return (
		<div onKeyUp={handleKeyUp} {...rest} tabIndex={-1}>
			{children}
		</div>
	);
};

export default InputTrigger;
