import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import ProgressBar from './ProgressBar';
import { Form } from './Shared/Form@2.0';

const Profile = lazy(() => import('./Profile'));
const Chat = lazy(() => import('./Chat'));
const Login = lazy(() => import('./Auth/LoginForm'));
const Register = lazy(() => import('./Auth/RegisterForm'));

const Routes: React.FC<{}> = props => {
	return (
		<Suspense fallback={<ProgressBar />}>
			<Switch>
				<Route exact path='/' component={Form} />

				<Route
					exact
					path='/login'
					render={props => <Login {...(props as any)} />}
				/>

				<Route
					exact
					path='/register'
					render={props => <Register {...(props as any)} />}
				/>

				<Route path='/chat' render={props => <Chat {...(props as any)} />} />

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
