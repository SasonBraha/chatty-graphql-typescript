import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { getOperationName } from './utils';
import mutationsOverSocket from './mutationsOverSocket';
import { createUploadLink } from 'apollo-upload-client';
import initialCache from './initialCache';
import { onError } from 'apollo-link-error';

interface IDefinition {
	kind: string;
	operation?: string;
	selectionSet: any;
}

const wsLink = () => {
	const authToken = localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN);

	const wsLink = new WebSocketLink({
		uri: `${process.env.REACT_APP_GRAPHQL_SOCKET_URL}`,
		options: {
			reconnect: true,
			connectionParams: () => ({
				authToken: authToken ? `Bearer ${authToken}` : null,
				fromUrl: window.location.href
			})
		}
	});

	const subscriptionMiddleware = {
		applyMiddleware(options: any, next: any) {
			options.fromUrl = window.location.href;
			next();
		}
	};

	// @ts-ignore
	wsLink.subscriptionClient.use([subscriptionMiddleware]);
	return wsLink;
};

const httpLink = createUploadLink({
	uri: process.env.REACT_APP_GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN);
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const apolloError = onError(({ graphQLErrors, operation }: any) => {
	if (graphQLErrors) {
		graphQLErrors.forEach((error: Error) => {
			//@ts-ignore
			switch (error.status) {
				case 401:
					localStorage.removeItem(process.env.REACT_APP_LS_AUTH_TOKEN);
					window.location.href = '/login';
			}
		});
	}
});

const link = split(
	({ query }) => {
		const { kind, operation, selectionSet }: IDefinition = getMainDefinition(
			query
		);
		return (
			(kind === 'OperationDefinition' && operation === 'subscription') ||
			mutationsOverSocket.includes(getOperationName(selectionSet))
		);
	},
	wsLink(),
	authLink.concat(apolloError).concat(httpLink)
);

const cache = new InMemoryCache({
	addTypename: false
});

const client = new ApolloClient({
	link,
	cache
});
cache.writeData(initialCache);

if (process.env.NODE_ENV === 'development') {
	window.apolloClient = client;
}

export default client;
