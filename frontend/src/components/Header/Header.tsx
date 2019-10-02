import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Burger, Button, Dropdown, List, Scrollable } from '../Shared';
import Ripple from 'react-ink';
import Icon from '../Shared/Icon';
import Notifications from './Notifications';
import i18n from '../../locale';
import {
	use_GetCurrentUserQuery,
	use_GetNotificationsDataQuery,
	use_SetAuthModalMutation,
	use_ToggleNavStateMutation,
	User
} from '../../__generated__/graphql';

interface IProps {}

const headerDropdownItems = (currentUser: User) => {
	return [
		{
			icon: 'icon-user',
			text: i18n.t('header.profileDropdown.myProfile'),
			linkTo: `/user/${currentUser!.slug}`,
			withRipple: true
		},
		{
			icon: 'icon-cog',
			text: i18n.t('header.profileDropdown.settings'),
			linkTo: '/user/settings',
			withRipple: true
		},
		{
			icon: 'icon-sign-out',
			text: i18n.t('header.profileDropdown.logout'),
			onClick() {
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
	const {
		data: { currentUser }
	} = use_GetCurrentUserQuery();
	const {
		data: {
			notificationsData: { unreadCount }
		}
	} = use_GetNotificationsDataQuery();
	const [toggleNavState] = use_ToggleNavStateMutation();
	const [setAuthModal] = use_SetAuthModalMutation();

	return (
		<S.Header>
			<Burger onClick={toggleNavState} />
			<S.Brand to='/'>Chatty</S.Brand>

			{currentUser ? (
				<S.HeaderMenu>
					<S.NotificationsDropdown
						onClick={() => setNotificationsDropdown(true)}
					>
						<Icon icon='icon-notifications' color='white' />
						{unreadCount ? (
							<S.UnreadNotifications>
								{unreadCount > 9 ? '+9' : unreadCount}
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
							<List items={headerDropdownItems(currentUser as User)} />
						</Dropdown>
					</S.ProfileDropdown>
				</S.HeaderMenu>
			) : (
				<S.AuthBtn
					onClick={() => setAuthModal({ variables: { isOpen: true } })}
				>
					{i18n.t('header.authButton')}
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
