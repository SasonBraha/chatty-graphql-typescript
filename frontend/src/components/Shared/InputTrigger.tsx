import React, { ReactNode, useState } from 'react';
import { KeyCodeEnum } from '../../types/enums';
import MentionSuggester from '../Chat/MentionSuggester';

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

	return (
		<div
			onKeyUp={async e => {
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
						which === KeyCodeEnum.BACKSPACE &&
						selectionStart! < triggerStartIndex
					) {
						setIsTriggered(false);
						typeof props.onCancel === 'function' && props.onCancel();
						return;
					}

					if (which === KeyCodeEnum.SPACE) {
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
					}, props.typeCallbackDebounce || 0);
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
