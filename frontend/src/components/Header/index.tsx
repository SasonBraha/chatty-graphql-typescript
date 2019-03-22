import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Burger, Dropdown, Button } from '../Shared';

const Header = () => (
	<StyledHeader>
		<Burger />
		<StyledBrand to='/'>Chatty</StyledBrand>
		<AuthButton>הרשמה / התחברות</AuthButton>
	</StyledHeader>
);

export default Header;

const StyledHeader = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 5;
	background: #1e242b;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	justify-items: center;
	position: relative;
`;

const StyledBrand = styled(Link)`
	font-weight: bold;
	font-size: 2.2rem;
	color: white;
	flex: 0 0;
	margin: auto;
	justify-self: center;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

const AuthButton = styled(Button)`
	margin-left: 3px;
`;
