import React, { useState, useEffect, ReactNode } from 'react';
import styled, { css } from 'styled-components/macro';
import { use_GetNavStateQuery } from '../../__generated__/graphql';

interface IProps {
	children: ReactNode;
}

const Container: React.FC<IProps> = props => {
	const [shouldShrink, setShouldShrink] = useState(window.innerWidth > 992);
	const {
		data: { isNavOpen }
	} = use_GetNavStateQuery();

	useEffect(() => {
		window.onresize = () => {
			const windowWidth = window.innerWidth;
			if (!shouldShrink && windowWidth > 992) {
				setShouldShrink(true);
			} else if (shouldShrink && windowWidth < 992) {
				setShouldShrink(false);
			}
		};
	}, [shouldShrink]);

	return (
		<S.Container navOpen={isNavOpen} shouldShrink={shouldShrink}>
			{props.children}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled('main')<{
	navOpen: boolean;
	shouldShrink: boolean;
}>`
	width: 100%;
	transition: 0.5s cubic-bezier(0.6, 0.07, 0.07, 1.08);
	will-change: width;
	height: calc(100vh - ${props => props.theme.headerHeight});

	${({ navOpen, shouldShrink, theme }) =>
		navOpen &&
		shouldShrink &&
		css`
			transform: translateX(calc(-1 * ${theme.navWidth}));
			width: calc(100% - ${theme.navWidth});
		`};
`;

export default Container;
