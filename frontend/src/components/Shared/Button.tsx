import React from 'react';
import styled from 'styled-components';
import Ripple from 'react-ink';

interface IProps {
	type?: string;
	text?: string;
	children?: React.ReactNode;
	icon?: string;
	showRipple?: boolean;
}

const Button: React.FC<IProps> = props => {
	const { children, text, type, icon, showRipple } = props;
	return (
		<S.Button type={type}>
			{children ? children : text} {showRipple && <Ripple />}
		</S.Button>
	);
};

Button.defaultProps = {
	type: 'button',
	showRipple: true
};

const S: any = {};
S.Button = styled.button`
	background: ${({ theme }) => theme.lightBlue};
	outline: none;
	border: none;
	padding: 0.7rem 2rem;
	color: white;
	cursor: pointer;
	border-radius: 0.3rem;
	position: relative;
	user-select: none;
`;

export default Button;
