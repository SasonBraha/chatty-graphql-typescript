import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import {
	use_GetCurrentUserQuery,
	use_SetGenericModalMutation
} from '../../../__generated__/graphql';
import { GenericModalTypesEnum } from '../../../types/enums';
import { useTranslation } from 'react-i18next';

const withAuth = (WrappedComponent: any) => {
	return (props): typeof WrappedComponent => {
		const {
			data: { currentUser }
		} = use_GetCurrentUserQuery();
		const [setGenericModal] = use_SetGenericModalMutation();
		const { t } = useTranslation();
		useEffect(() => {
			if (!currentUser) {
				setGenericModal({
					variables: {
						data: {
							type: GenericModalTypesEnum.ERROR,
							text: t('global.youMustBeLoggedInToViewThisPage')
						}
					}
				});
			}
		}, [currentUser]);

		return currentUser ? (
			<WrappedComponent {...props} />
		) : (
			<Redirect to='/login' />
		);
	};
};

export default withAuth;
