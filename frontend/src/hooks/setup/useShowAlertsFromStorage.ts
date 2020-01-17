import { LocalStorageEnum } from '../../types/enums';
import { use_SetGenericModalMutation } from '../../__generated__/graphql';
import { useEffect } from 'react';

const useShowAlertsFromStorage = () => {
	const [setGenericModal] = use_SetGenericModalMutation();
	useEffect(() => {
		const onLoadMessage = localStorage.getItem(
			LocalStorageEnum.ON_LOAD_MESSAGE
		);
		if (onLoadMessage) {
			const { message, type } = JSON.parse(onLoadMessage);
			setGenericModal({
				variables: {
					data: {
						text: message,
						type
					}
				}
			});
			localStorage.removeItem(LocalStorageEnum.ON_LOAD_MESSAGE);
		}
	}, []);
};

export default useShowAlertsFromStorage;
