import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import apolloClient from './apollo/client';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './style/theme';
import { ApolloProvider } from '@apollo/react-hooks';
import './style/base.css';

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<Router>
			<ThemeProvider theme={defaultTheme}>
				<App />
			</ThemeProvider>
		</Router>
	</ApolloProvider>,
	document.getElementById('reactMount')
);
