import React from 'react';
import MaterialSpinner from 'react-spinner-material';

interface IProps {
	size: number;
	spinnerColor: string;
	spinnerWidth: number;
	visible: boolean;
}

// @ts-ignore
const Spinner = (props: IProps) => <MaterialSpinner {...props} />;

export default Spinner;
