import React, { useEffect, useState } from 'react';
import { INotification } from '../../types/interfaces';
import { ListItem, Scrollable } from '../Shared';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useGetNotificationsLazyQuery } from '../../__generated__/graphql';
import { useTranslation } from 'react-i18next';
import Spinner from '../Shared/Spinner';

interface IProps {
	isOpen: boolean;
}

enum NotificationTypesEnum {
	USER_MENTION = 'USER_MENTION'
}

const convertNotificationToListItemData = (notification: INotification) => {
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

//@ts-ignore
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
	}, [props.isOpen]);

	useEffect(() => {
		if (data && !loading) {
			setNotifications([...notifications, ...data.notifications]);
		}
	}, [data]);

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
				<ul>
					{notifications.length
						? notifications.map((notification: INotification) => (
								<ListItem
									key={notification._id}
									{...convertNotificationToListItemData(notification)}
									withRipple
								/>
						  ))
						: t('header.noNotificationsFound')}
				</ul>
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

S.Username = styled(Link)`
	font-weight: bold;
	margin: 0 0.5rem;

	&:hover {
		text-decoration: underline;
	}
`;

export default Notifications;
