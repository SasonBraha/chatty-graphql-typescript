import React, { useEffect, useState } from 'react';
import { INotification } from '../../types/interfaces';
import { ListItem } from '../Shared';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useGetNotificationsLazyQuery } from '../../__generated__/graphql';

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

const Notifications: React.FC<IProps> = props => {
	const [notifications, setNotifications] = useState([]);
	const [
		execNotificationsQuery,
		{ data, loading }
	] = useGetNotificationsLazyQuery();

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
		<ul>
			{notifications.map((notification: INotification) => (
				<ListItem
					key={notification._id}
					{...convertNotificationToListItemData(notification)}
					withRipple
				/>
			))}
		</ul>
	);
};

const S: any = {};
S.Username = styled(Link)`
	font-weight: bold;
	margin: 0 0.5rem;

	&:hover {
		text-decoration: underline;
	}
`;

export default Notifications;
