import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Burger, Dropdown, Button } from '../Shared';
import { connect } from 'react-redux';
import { setAuthModal } from '../../redux/actions';
import Ripple from 'react-ink';
import { IUser } from '../../models';

interface IProps {
	setAuthModal: typeof setAuthModal;
	currentUser: IUser | null;
}

const Header = ({ setAuthModal, currentUser }: IProps) => (
	<StyledHeader>
		<Burger />
		<StyledBrand to='/'>Chatty</StyledBrand>

		{currentUser ? (
			<div />
		) : (
			<AuthButton onClick={() => setAuthModal(true)}>
				הרשמה / התחברות
				<Ripple />
			</AuthButton>
		)}
	</StyledHeader>
);

const mapStateToProps = ({ currentUser }: { currentUser: IUser | null }) => ({
	currentUser
});
export default connect(
	mapStateToProps,
	{ setAuthModal }
)(Header);

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
