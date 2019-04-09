import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';

const wsLink = new WebSocketLink({
	uri: `${process.env.REACT_APP_GRAPHQL_SOCKET_URL}`,
	options: {
		reconnect: true,
		connectionParams: {
			authToken: `Bearer ${localStorage.getItem(
				process.env.REACT_APP_LS_AUTH_TOKEN
			)}`
		}
	}
});

const client = new ApolloClient({
	link: wsLink,
	cache: new InMemoryCache()
});

export default client;
