import { useEffect } from 'react';
import { UserUpdatesEnum } from '../../types/enums';
import {
	use_GetNotificationsDataQuery,
	use_SetNotificationsDataMutation,
	useUserUpdatesSubscription
} from '../../__generated__/graphql';

const useNotificationsSubscription = () => {
	const { data: userUpdatesData, loading } = useUserUpdatesSubscription();
	const [setNotificationsData] = use_SetNotificationsDataMutation();
	const {
		data: {
			notificationsData: { unreadCount }
		}
	} = use_GetNotificationsDataQuery();

	useEffect(() => {
		if (!loading && userUpdatesData) {
			const updateData = JSON.parse(userUpdatesData.userUpdates);
			switch (updateData.type) {
				case UserUpdatesEnum.NEW_NOTIFICATION:
					setNotificationsData({
						variables: {
							data: {
								unreadCount: unreadCount + 1
							}
						}
					});
					break;
			}
		}
	}, [userUpdatesData]);
};

export default useNotificationsSubscription;
