import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from 'react-apollo-hooks';
import { INotification } from '../../types/interfaces';
import { ListItem } from '../Shared';

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
				text: `
					המשתמש ${notification.sender.displayName} תייג אותך 
				`,
				linkTo: ''
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
				/>
			))}
		</ul>
	);
};

export default Notifications;
