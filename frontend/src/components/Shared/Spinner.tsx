import React from 'react';
import MaterialSpinner from 'react-spinner-material';

interface IProps {
	size: number;
	spinnerColor: string;
	spinnerWidth: number;
	visible: boolean;
	className?: string;
}

const Spinner: React.FC<IProps> = props => <MaterialSpinner {...props} />;

export default Spinner;
