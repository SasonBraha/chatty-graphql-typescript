import React, { ReactNode, useRef } from 'react';
import styled from 'styled-components';

interface IProps {
	onReachBottom?: () => any | void;
	onReachTop?: () => any | void;
	whileScrolling?: () => any | void;
	offsetToCallback?: number;
	reachBottomDebounce?: number;
	reachTopDebounce?: number;
	children?: ReactNode;
}

const Scrollable: React.FC<IProps> = props => {
	const {
		onReachBottom,
		onReachTop,
		whileScrolling,
		offsetToCallback = 0,
		reachBottomDebounce = 0,
		reachTopDebounce = 0
	} = props;
	const scrollableRef: any = useRef();
	return (
		<ScScrollable
			onScroll={() => {
				if (typeof whileScrolling === 'function') {
					whileScrolling();
				}

				if (typeof onReachBottom === 'function') {
					const isReachedOffset =
						scrollableRef.scrollHeight - reachBottomDebounce <=
						scrollableRef.scrollTop + scrollableRef.clientHeight;
					const isReachedBottom =
						scrollableRef.scrollHeight ===
						scrollableRef.scrollTop + scrollableRef.clientHeight;

					if (isReachedBottom || isReachedOffset) {
						onReachBottom();
					}
				}
			}}
			ref={scrollableRef}
		>
			{props.children}
		</ScScrollable>
	);
};

const ScScrollable = styled.div`
	max-height: 100%;
	overflow-y: auto;
`;

export default Scrollable;
