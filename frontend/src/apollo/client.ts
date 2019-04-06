import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

interface IDefinintion {
	kind: string;
	operation?: string;
}

const wsLink = new WebSocketLink({
	uri: `ws://localhost:5000/subscriptions`,
	options: {
		reconnect: true,
		connectionParams: {
			authToken: localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN)
		}
	}
});

const httpLink = createHttpLink({
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
		const { kind, operation }: IDefinintion = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	authLink.concat(httpLink)
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
});

export default client;
