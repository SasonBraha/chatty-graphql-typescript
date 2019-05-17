import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
const Chat = lazy(() => import('./Chat'));
const LoginForm = lazy(() => import('./Auth/LoginForm'));
const RegisterForm = lazy(() => import('./Auth/RegisterForm'));

const Routes: React.FC<{}> = props => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Switch>
				<Route
					exact
					path='/register'
					render={props => <RegisterForm {...props} />}
				/>

				<Route exact path='/login' render={props => <LoginForm {...props} />} />

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
