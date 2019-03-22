import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import store from './Redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { client as ApolloClient } from './ApolloClient';
import './base.css';

ReactDOM.render(
	<ApolloProvider client={ApolloClient}>
		<ReduxProvider store={store}>
			<Router>
				<App />
			</Router>
		</ReduxProvider>
	</ApolloProvider>,
	document.getElementById('reactMount')
);
