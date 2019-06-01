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
	className?: string;
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
	let reachTopTimeout: ReturnType<typeof setTimeout>;
	let reachBottomTimeout: ReturnType<typeof setTimeout>;
	return (
		<ScScrollable
			onScroll={e => {
				const target = e.target as HTMLDivElement;
				if (typeof whileScrolling === 'function') {
					whileScrolling();
				}

				if (typeof onReachBottom === 'function') {
					const isReachedOffset =
						target.scrollHeight - offsetToCallback <=
						target.scrollTop + target.clientHeight;
					const isReachedBottom =
						target.scrollHeight === target.scrollTop + target.clientHeight;

					if (isReachedBottom || isReachedOffset) {
						clearTimeout(reachBottomTimeout);
						reachBottomTimeout = setTimeout(onReachBottom, reachBottomDebounce);
					}
				}

				if (typeof onReachTop === 'function') {
					const isReachedOffset = target.scrollTop < offsetToCallback;
					const isReachedTop = target.scrollTop === 0;

					if (isReachedOffset || isReachedTop) {
						clearTimeout(reachTopTimeout);
						reachTopTimeout = setTimeout(onReachTop, reachTopDebounce);
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
