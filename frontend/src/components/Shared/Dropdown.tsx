import React, { useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { validCss } from '../../utils';

interface IProps {
	resetDropdown(): void;
	isOpen: boolean;
	background?: string;
	color?: string;
	top: number;
	left: number;
	width: number;
	children?: JSX.Element[] | JSX.Element;
}

const Dropdown = (props: IProps) => {
	const { isOpen } = props;

	useEffect(() => {
		isOpen
			? document.body.addEventListener('click', props.resetDropdown)
			: document.body.removeEventListener('click', props.resetDropdown);
	}, [isOpen]);

	return <StyledDropdown {...props}>{props.children}</StyledDropdown>;
};

Dropdown.defaultProps = {
	color: 'black',
	top: 0,
	left: 0,
	width: 200,
	background: 'white'
};

const StyledDropdown = styled('div')<IProps>`
	background: ${({ background }) => background};
	color: ${({ color }) => color};
	top: ${({ top }) => validCss(top)};
	left: ${({ left }) => validCss(left)};
	width: ${({ width }) => validCss(width)};
	box-shadow: 0 0.4rem 0.7rem var(--shadow);
	position: absolute;
	transition: all 0.15s, transform 0.2s;
	transform-origin: left top;
	visibility: hidden;
	opacity: 0;
	transform: scale(0.5);
	min-width: 20rem;
	z-index: 9999;
	overflow-y: auto;

	${({ isOpen }) =>
		isOpen &&
		css`
			visibility: visible;
			opacity: 1;
			transform: scale(1);
		`}
`;

export default Dropdown;