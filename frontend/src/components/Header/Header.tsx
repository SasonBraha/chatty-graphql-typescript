import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Burger, Button, Dropdown, List, Scrollable } from '../Shared';
import Ripple from 'react-ink';
import { IUser } from '../../types/interfaces';
import Icon from '../Shared/Icon';
import Notifications from './Notifications';
import { setAuthModal, setNavState } from '../../apollo/actions';
import { useLocalCache } from '../Shared/Hooks';
import { USER_ENTITY_FRAGMENT } from '../../apollo/fragments';

interface IProps {}

const headerDropdownItems = (currentUser: IUser) => {
	return [
		{
			icon: 'icon-user',
			text: 'הפרופיל שלי',
			linkTo: `/user/${currentUser!.slug}`,
			withRipple: true
		},
		{
			icon: 'icon-cog',
			text: 'הגדרות',
			linkTo: '/user/settings',
			withRipple: true
		},
		{
			icon: 'icon-sign-out',
			text: 'התנתק',
			onClick: () => {
				localStorage.removeItem(process.env.REACT_APP_LS_AUTH_TOKEN);
				window.location.href = '/';
			},
			withRipple: true
		}
	];
};

const Header: React.FC<IProps> = props => {
	const [isProfileDropdownOpen, setProfileDropdown] = useState(false);
	const [isNotificationsDropdownOpen, setNotificationsDropdown] = useState(
		false
	);
	const { currentUser, notifications } = useLocalCache(`
		currentUser {
			${USER_ENTITY_FRAGMENT}
		}
		notifications {
			unreadCount
		}
	`);

	return (
		<S.Header>
			<Burger onClick={setNavState} />
			<S.Brand data-e2e-id='brand' to='/'>
				Chatty
			</S.Brand>

			{currentUser ? (
				<S.HeaderMenu>
					<S.NotificationsDropdown
						onClick={() => setNotificationsDropdown(true)}
					>
						<Icon icon='icon-notifications' color='white' />
						{notifications.unreadCount ? (
							<S.UnreadNotifications>
								{notifications.unreadCount > 9
									? '+9'
									: notifications.unreadCount}
							</S.UnreadNotifications>
						) : (
							''
						)}

						<Dropdown
							resetDropdown={() => setNotificationsDropdown(false)}
							isOpen={isNotificationsDropdownOpen}
							width={400}
							height={200}
						>
							<Scrollable
								onReachBottom={() => {
									//TODO - FETCH MORE NOTIFICATIONS
								}}
								offsetToCallback={20}
							>
								<Notifications isOpen={isNotificationsDropdownOpen} />
							</Scrollable>
						</Dropdown>
					</S.NotificationsDropdown>

					<S.ProfileDropdown onClick={() => setProfileDropdown(true)}>
						<S.ProfileImg src={currentUser.avatar} />
						<Dropdown
							isOpen={isProfileDropdownOpen}
							resetDropdown={() => setProfileDropdown(false)}
						>
							<List items={headerDropdownItems(currentUser)} />
						</Dropdown>
					</S.ProfileDropdown>
				</S.HeaderMenu>
			) : (
				<S.AuthBtn onClick={() => setAuthModal(true)}>
					הרשמה / התחברות
					<Ripple />
				</S.AuthBtn>
			)}
		</S.Header>
	);
};

const S: any = {};
S.Header = styled.header`
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

S.Brand = styled(Link)`
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

S.AuthBtn = styled(Button)`
	margin-left: 3px;
`;

S.HeaderMenu = styled.div`
	display: flex;
`;

S.NotificationsDropdown = styled.div`
	cursor: pointer;
	position: relative;
`;

S.ProfileDropdown = styled.div`
	margin-left: 1.5rem;
	margin-right: 1.3rem;
	position: relative;
	cursor: pointer;
`;

S.ProfileImg = styled.img`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	vertical-align: middle;
	position: relative;
	pointer-events: none;
`;

S.UnreadNotifications = styled.small`
	background: red;
	width: 1.6rem;
	height: 1.6rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 0.3rem;
	position: absolute;
	right: 0;
	top: 0;
	color: white;
	font-size: 1.2rem;
`;

export default Header;
