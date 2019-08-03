import React from 'react';
import styled from 'styled-components/macro';

interface IProps {
	onClick: () => void;
}

const Burger = (props: IProps) => (
	<S.Wrapper {...props}>
		<S.Burger />
	</S.Wrapper>
);

const S: any = {};
S.Burger = styled.div`
	position: relative;

	&,
	&::before,
	&::after {
		width: 3rem;
		height: 3px;
		display: inline-block;
		background: white;
	}

	&::before,
	&::after {
		content: '';
		position: absolute;
		left: 0;
		transition: 0.3s;
	}

	&::before {
		top: -0.9rem;
	}

	&::after {
		top: 0.9rem;
	}
`;

S.Wrapper = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	height: 100%;
	margin-right: 1rem;

	&:hover ${S.Burger} {
		&::before {
			left: 5px;
		}

		&::after {
			left: -5px;
		}
	}
`;

export default Burger;
