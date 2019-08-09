import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import apolloClient from './apollo/client';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './style/theme';
import './style/base.css';
import { ApolloProvider } from '@apollo/react-hooks';

const HMRApp = hot(App);

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<Router>
			<ThemeProvider theme={defaultTheme}>
				<HMRApp />
			</ThemeProvider>
		</Router>
	</ApolloProvider>,
	document.getElementById('reactMount')
);
