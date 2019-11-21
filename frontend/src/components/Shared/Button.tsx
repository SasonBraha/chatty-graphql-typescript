import React from 'react';
import styled from 'styled-components';
import Ripple from 'react-ink';
import Spinner from './Spinner';

interface IProps {
	type?: string;
	text?: string;
	children?: React.ReactNode;
	icon?: string;
	showRipple?: boolean;
	loading?: boolean;
}

const Button: React.FC<IProps> = props => {
	const { children, text, type, icon, showRipple, loading } = props;
	return (
		<S.Button disabled={loading} type={type}>
			{children ? children : text}
			{showRipple && <Ripple />}
			{loading && (
				<S.SpinnerContainer>
					<Spinner
						size={13}
						spinnerColor='white'
						spinnerWidth={2}
						visible={true}
					/>
				</S.SpinnerContainer>
			)}
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
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

S.SpinnerContainer = styled.div`
	position: relative;
	left: -0.8rem;
	top: -0.05rem;
`;

export default Button;
