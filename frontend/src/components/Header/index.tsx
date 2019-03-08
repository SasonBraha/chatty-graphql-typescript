import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Burger from './Burger';

const Header = () => (
	<StyledHeader>
		<Burger />
		<StyledBrand to='/'>Chatty</StyledBrand>
	</StyledHeader>
);

export default Header;

const StyledHeader = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 5;
	background: #1e242b;
`;

const StyledBrand = styled(Link)`
	font-weight: bold;
	font-size: 2.2rem;
	color: white;
	flex: 0 0;
`;
