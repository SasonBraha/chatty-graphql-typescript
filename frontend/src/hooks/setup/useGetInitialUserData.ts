import { useEffect } from 'react';
import {
	use_GetCurrentUserQuery,
	use_SetNotificationsDataMutation,
	useMeLazyQuery
} from '../../__generated__/graphql';

const useGetInitialUserData = () => {
	const [execMeQuery, { data: meData }] = useMeLazyQuery();
	const {
		data: { currentUser }
	} = use_GetCurrentUserQuery();
	const [setNotificationsData] = use_SetNotificationsDataMutation();

	useEffect(() => {
		if (currentUser) {
			execMeQuery();
		}
	}, [currentUser]);

	useEffect(() => {
		if (meData) {
			setNotificationsData({
				variables: {
					data: {
						unreadCount: meData.me.unreadNotificationsCount
					}
				}
			});
		}
	}, [meData]);
};

export default useGetInitialUserData;
