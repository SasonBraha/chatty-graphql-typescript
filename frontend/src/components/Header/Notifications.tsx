import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from 'react-apollo-hooks';
import { INotification } from '../../types/interfaces';
import { ListItem } from '../Shared';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

const NOTIFICATIONS_QUERY = gql`
	query {
		notifications {
			_id
			ref
			sender {
				displayName
				slug
			}
			type
		}
	}
`;

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
						<ScUsername to={`/user/${notification.sender.slug}`}>
							{notification.sender.displayName}
						</ScUsername>
						תייג אותך בהודעה
					</>
				)
			};
			break;
	}
};

const Notifications: React.FC<IProps> = props => {
	const [notifications, setNotifications] = useState([]);
	const client = useApolloClient();
	useEffect(() => {
		if (props.isOpen && !notifications.length) {
			client
				.query({
					query: NOTIFICATIONS_QUERY
				})
				.then(queryObject => {
					const { data } = queryObject;
					setNotifications([...notifications, ...data.notifications] as any);
				});
		}
	}, [props.isOpen]);

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

const ScUsername = styled(Link)`
	font-weight: bold;
	margin: 0 0.5rem;

	&:hover {
		text-decoration: underline;
	}
`;

export default Notifications;
