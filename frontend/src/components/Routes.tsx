import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Profile = lazy(() => import('./Profile'));
const Chat = lazy(() => import('./Chat'));

const Routes: React.FC<{}> = props => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Switch>
				<Route
					exact
					path='/chat/:chatSlug'
					render={props => <Chat {...(props as any)} />}
				/>

				<Route
					exact
					path='/user/:slug'
					render={props => <Profile {...props} />}
				/>
			</Switch>
		</Suspense>
	);
};

export default Routes;
