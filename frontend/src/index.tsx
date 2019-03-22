import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import store from './redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import apolloClient from './apollo/client';
import './base.css';

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<ReduxProvider store={store}>
			<Router>
				<App />
			</Router>
		</ReduxProvider>
	</ApolloProvider>,
	document.getElementById('reactMount')
);
