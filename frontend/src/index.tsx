import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import apolloClient from './apollo/client';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './style/theme';
import './style/base.css';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<ApolloHooksProvider client={apolloClient}>
			<Router>
				<ThemeProvider theme={defaultTheme}>
					<App />
				</ThemeProvider>
			</Router>
		</ApolloHooksProvider>
	</ApolloProvider>,
	document.getElementById('reactMount')
);
