import React from 'react';
import styled from 'styled-components';

const ActiveUsers = () => <StyledActiveUsers />;

const StyledActiveUsers = styled.div`
	padding: 0 2rem 0 2rem;
	text-align: center;
	height: 100%;
	background: ${props => props.theme.activeUsersBackground};
	padding: 0.5rem;
	overflow-y: auto;
	overflow-x: hidden;
	transition: 0.25s;
	color: white;
	grid-column: 2 / 3;
`;

export default ActiveUsers;
