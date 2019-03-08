import React from 'react';
import styled from 'styled-components/macro';

const Burger = () => <StyledBurger />;

const StyledBurger = styled.div`
	height: 0.3rem;

	&,
	&::before,
	&::after {
		background: white;
	}

	&::before,
	&::after {
		content: '';
	}
`;

export default Burger;
