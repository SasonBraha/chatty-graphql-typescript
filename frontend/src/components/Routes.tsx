import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { RegisterForm } from './Auth';
const Chat = lazy(() => import('./Chat'));

const Routes: React.FC<{}> = props => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Switch>
				<Route exact path='/register' component={RegisterForm} />
				<Route
					exact
					path='/chat/:chatSlug'
					render={props => <Chat {...props} />}
				/>
			</Switch>
		</Suspense>
	);
};

export default Routes;
