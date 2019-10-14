import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { afterRender } from '../utils';

const ProgressBar: React.FC = () => {
	useEffect(() => {
		NProgress.inc();
		return () => afterRender(() => NProgress.done());
	}, []);

	return null;
};

export default ProgressBar;
