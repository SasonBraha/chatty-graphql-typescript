import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Burger, Button, Dropdown, ListItem } from '../Shared';
import { connect } from 'react-redux';
import { setAuthModal, setNavState } from '../../redux/actions';
import Ripple from 'react-ink';
import { IUser } from '../../types/interfaces';
import { IReducerState } from '../../redux/reducers';

interface IProps {
	setAuthModal: typeof setAuthModal;
	setNavState: typeof setNavState;
	currentUser: IUser | null;
}

const headerDropdownItmes = (props: IProps) => {
	return [
		{
			icon: 'icon-user',
			text: 'הפרופיל שלי',
			to: `/user/${props.currentUser!.slug}`
		},
		{
			icon: 'icon-cog',
			text: 'הגדרות',
			to: '/user/settings'
		},
		{
			icon: 'icon-sign-out',
			text: 'התנתק',
			onClick: () => {
				localStorage.removeItem(process.env.REACT_APP_LS_AUTH_TOKEN);
				window.location.href = '/';
			}
		}
	];
};

const Header: React.FC<IProps> = props => {
	const { setAuthModal, setNavState, currentUser } = props;
	const [isHeaderDropdownOpen, setHeaderDropdown] = useState(false);

	return (
		<ScHeader>
			<Burger onClick={setNavState} />
			<ScBrand to='/'>Chatty</ScBrand>

			{currentUser ? (
				<ScHeaderMenu>
					<ScProfileDropdown onClick={() => setHeaderDropdown(true)}>
						<ScProfileImg src={currentUser.avatar} />
						<Dropdown
							isOpen={isHeaderDropdownOpen}
							resetDropdown={() => setHeaderDropdown(false)}
						>
							<ul>
								{headerDropdownItmes(props).map(
									({ icon, text, onClick, to }, i) => (
										<ListItem
											key={i}
											icon={icon}
											linkTo={to}
											onClick={onClick}
											withRipple
										>
											{text}
										</ListItem>
									)
								)}
							</ul>
						</Dropdown>
					</ScProfileDropdown>
				</ScHeaderMenu>
			) : (
				<ScAuthBtn onClick={() => setAuthModal(true)}>
					הרשמה / התחברות
					<Ripple />
				</ScAuthBtn>
			)}
		</ScHeader>
	);
};

const mapStateToProps = ({ currentUser }: IReducerState) => ({
	currentUser
});
export default connect(
	mapStateToProps,
	{ setAuthModal, setNavState }
)(Header);

const ScHeader = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 5;
	background: ${props => props.theme.navBackground};
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	justify-items: center;
	position: relative;
	height: ${props => props.theme.headerHeight};
`;

const ScBrand = styled(Link)`
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

const ScAuthBtn = styled(Button)`
	margin-left: 3px;
`;

const ScHeaderMenu = styled.div`
	display: flex;
`;

const ScProfileDropdown = styled.div`
	margin-left: 1.5rem;
	margin-right: 1.3rem;
	position: relative;
	cursor: pointer;
`;

const ScProfileImg = styled.img`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	vertical-align: middle;
	position: relative;
	pointer-events: none;
`;
