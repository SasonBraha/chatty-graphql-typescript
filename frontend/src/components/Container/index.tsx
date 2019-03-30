import React, { useState, useEffect, ReactNode } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components/macro';
import { IReducerState } from '../../redux/reducers';

interface IProps {
	isNavOpen: boolean;
	children: ReactNode;
}

const Container = (props: IProps) => {
	const [shouldShrink, setShouldShrink] = useState(window.innerWidth > 992);
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
		<StyledContainer navOpen={props.isNavOpen} shouldShrink={shouldShrink}>
			{props.children}
		</StyledContainer>
	);
};

const StyledContainer = styled('main')<{
	navOpen: boolean;
	shouldShrink: boolean;
}>`
	width: 100%;
	transition: 0.5s cubic-bezier(0.6, 0.07, 0.07, 1.08);
	will-change: width;

	${({ navOpen, shouldShrink }) =>
		navOpen &&
		shouldShrink &&
		css`
			transform: translateX(calc(-1 * ${props => props.theme.navWidth}));
			width: calc(100% - ${props => props.theme.navWidth});
		`};
`;

const mapStateToProps = ({ isNavOpen }: IReducerState) => ({ isNavOpen });
export default connect(
	mapStateToProps,
	null
)(Container);
