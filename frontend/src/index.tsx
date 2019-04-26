import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import store from './redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import apolloClient from './apollo/client';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './style/theme';
import './style/base.css';

if (process.env.NODE_ENV !== 'production') {
	const whyDidYouRender = require('@welldone-software/why-did-you-render');
	whyDidYouRender(React);
}

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<ReduxProvider store={store}>
			<Router>
				<ThemeProvider theme={defaultTheme}>
					<App />
				</ThemeProvider>
			</Router>
		</ReduxProvider>
	</ApolloProvider>,
	document.getElementById('reactMount')
);
