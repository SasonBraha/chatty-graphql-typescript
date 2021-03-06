import React, { useEffect, useState } from 'react';
import { ListItem, Scrollable } from '../Shared';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
	Notification,
	useGetNotificationsLazyQuery
} from '../../__generated__/graphql';
import { useTranslation } from 'react-i18next';
import Spinner from '../Shared/Spinner';

interface IProps {
	isOpen: boolean;
}

enum NotificationTypesEnum {
	USER_MENTION = 'USER_MENTION'
}

const convertNotificationToListItemData = (notification: Notification) => {
	switch (notification.type) {
		case NotificationTypesEnum.USER_MENTION:
			return {
				icon: 'icon-at-sign',
				linkTo: '',
				children: (
					<>
						המשתמש
						<S.Username to={`/user/${notification.sender.slug}`}>
							{notification.sender.displayName}
						</S.Username>
						תייג אותך בהודעה
					</>
				)
			};
	}
};

const Notifications: React.FC<IProps> = props => {
	const [notifications, setNotifications] = useState([]);
	const [
		execNotificationsQuery,
		{ data, loading }
	] = useGetNotificationsLazyQuery();
	const { t } = useTranslation();

	useEffect(() => {
		if (props.isOpen && !notifications.length) {
			execNotificationsQuery();
		}
	}, [props.isOpen, notifications]);

	useEffect(() => {
		if (data && !loading) {
			setNotifications([...notifications, ...data.notifications]);
		}
	}, [data, loading]);

	return (
		<S.Wrapper
			onReachBottom={() => {
				//TODO - FETCH MORE NOTIFICATIONS
			}}
			offsetToCallback={20}
		>
			{loading ? (
				<Spinner size={35} spinnerColor={'#0079ea'} spinnerWidth={3} visible />
			) : (
				<S.List>
					{notifications.length
						? notifications.map((notification: Notification) => (
								<ListItem
									key={notification._id}
									{...convertNotificationToListItemData(notification)}
									withRipple
								/>
						  ))
						: t('header.noNotificationsFound')}
				</S.List>
			)}
		</S.Wrapper>
	);
};

const S: any = {};
S.Wrapper = styled(Scrollable)`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

S.List = styled.ul`
	width: 100%;
	height: 100%;
`;

S.Username = styled(Link)`
	font-weight: bold;
	margin: 0 0.5rem;

	&:hover {
		text-decoration: underline;
	}
`;

export default Notifications;
