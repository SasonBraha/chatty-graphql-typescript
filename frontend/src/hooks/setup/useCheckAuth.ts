import { useLayoutEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { use_UpdateCurrentUserMutation } from '../../__generated__/graphql';

const useCheckAuth = () => {
	const [updateCurrentUser] = use_UpdateCurrentUserMutation();

	useLayoutEffect(() => {
		const accessToken = localStorage.getItem(
			process.env.REACT_APP_LS_AUTH_TOKEN
		);
		if (accessToken) {
			updateCurrentUser({
				variables: {
					user: jwtDecode(accessToken)
				}
			});
		}
	}, []);
};

export default useCheckAuth;
