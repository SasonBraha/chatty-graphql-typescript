import React, { useEffect, ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components/macro';
import { validCss } from '../../utils';

interface IProps {
	resetDropdown(): void;
	isOpen: boolean;
	background?: string;
	color?: string;
	top?: number;
	left?: number;
	width?: number;
	children?: ReactNode;
	height?: number;
}

const Dropdown = React.forwardRef((props: IProps, ref: Ref<any>) => {
	const { isOpen } = props;

	useEffect(() => {
		if (isOpen) {
			document.body.addEventListener('click', props.resetDropdown, {
				once: true
			});
		}
	}, [isOpen]);

	return (
		<S.Dropdown ref={ref} {...props}>
			{props.children}
		</S.Dropdown>
	);
});

Dropdown.defaultProps = {
	color: 'black',
	top: 0,
	left: 0,
	width: 200,
	background: 'white'
};

const S: any = {};
S.Dropdown = styled('div')<IProps>`
	background: ${({ background }) => background};
	color: ${({ color }) => color};
	top: ${({ top }) => validCss(top!)};
	left: ${({ left }) => validCss(left!)};
	position: absolute;
	transition: all 0.15s, transform 0.17s, left 0s, top 0s;
	transform-origin: left top;
	visibility: hidden;
	opacity: 0;
	transform: scale(0.5);
	min-width: ${({ width }) => validCss(width!)};
	z-index: 9999;
	border-radius: 0.3rem;
	${props => props.theme.boxShadow};
	height: ${({ height }) => (height ? `${height}px` : '')};

	${({ isOpen }) =>
		isOpen &&
		css`
			visibility: visible;
			opacity: 1;
			transform: scale(1);
		`}
`;

export default Dropdown;
