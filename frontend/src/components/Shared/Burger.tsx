import React from 'react';
import styled from 'styled-components/macro';

const Burger = () => (
	<StyledWrapper>
		<StyledBurger />
	</StyledWrapper>
);

const StyledWrapper = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	height: 100%;
	margin-right: 1rem;
`;

const StyledBurger = styled.div`
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
		transition: 0.2s;
	}

	&::before {
		top: -0.9rem;
	}

	&::after {
		top: 0.9rem;
	}
`;

export default Burger;
