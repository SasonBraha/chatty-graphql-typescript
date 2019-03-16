import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Burger, Dropdown } from '../Shared';

const Header = () => (
	<StyledHeader>
		<Burger />
		<StyledBrand to='/'>Chatty</StyledBrand>
		<div className='headerOptions'>
			{/* Private Messages - Chats */}
			{/* Notifications */}
			<Dropdown isOpen={false} resetDropdown={() => null}>
				<div>Hello</div>
			</Dropdown>
		</div>
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
`;

const StyledBrand = styled(Link)`
	font-weight: bold;
	font-size: 2.2rem;
	color: white;
	flex: 0 0;
`;
