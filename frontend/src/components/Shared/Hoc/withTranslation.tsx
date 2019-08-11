import React from 'react';
import { useTranslation } from 'react-i18next';

const withTranslation = () => (
	WrappedComponent: any
): typeof WrappedComponent => {
	return props => {
		const { t } = useTranslation();
		return <WrappedComponent {...props} t={t} />;
	};
};

export default withTranslation;
