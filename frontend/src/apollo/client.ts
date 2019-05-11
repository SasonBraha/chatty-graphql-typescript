import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { getOperationName } from './utils';
import mutationsOverSocket from './mutationsOverSocket';
import { createUploadLink } from 'apollo-upload-client';

interface IDefinition {
	kind: string;
	operation?: string;
	selectionSet: any;
}

const wsLink = () => {
	const authToken = localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN);

	return new WebSocketLink({
		uri: `${process.env.REACT_APP_GRAPHQL_SOCKET_URL}`,
		options: {
			reconnect: true,
			connectionParams: {
				authToken: authToken ? `Bearer ${authToken}` : null,
				fromUrl: window.location.href
			}
		}
	});
};
const httpLink = createUploadLink({
	uri: process.env.REACT_APP_GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
	// Get the authentication token from local storage if it exists
	const token = localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN);
	// Return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
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
	authLink.concat(httpLink)
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache({
		addTypename: false
	})
});

if (process.env.NODE_ENV === 'development') {
	window.apolloClient = client;
}

export default client;
