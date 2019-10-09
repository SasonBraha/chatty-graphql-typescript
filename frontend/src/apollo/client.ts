import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import {
	InMemoryCache,
	IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';
import {
	ErrorTypesEnum,
	GenericModalTypesEnum,
	LocalStorageEnum
} from '../types/enums';
import { getApolloOperationName } from '../utils';
import { initialState, resolvers } from '../cache';
import { setGenericModal } from '../cache/resolvers';
import introspectionQueryResultData from '../fragmentTypes.json';

interface IDefinition {
	kind: string;
	operation?: string;
	selectionSet: any;
}

const webSocketLink = () => {
	const authToken = localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN);

	const wsLink = new WebSocketLink({
		uri: `${process.env.REACT_APP_GRAPHQL_SOCKET_URL}`,
		options: {
			reconnect: true,
			connectionParams: () => ({
				authToken: authToken || '',
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
	uri: process.env.REACT_APP_GRAPHQL_URI,
	credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem(process.env.REACT_APP_LS_AUTH_TOKEN);
	return {
		headers: {
			...headers,
			authorization: token || ''
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
					localStorage.setItem(
						LocalStorageEnum.ON_LOAD_MESSAGE,
						JSON.stringify({
							message: ErrorTypesEnum.INVALID_TOKEN,
							type: GenericModalTypesEnum.ERROR
						})
					);
					window.location.href = '/login';
					break;

				case 500:
					setGenericModal({
						type: GenericModalTypesEnum.ERROR,
						text: ErrorTypesEnum.SOMETHING_WENT_WRONG
					});
					break;
			}
		});
	}
});

const mutationsOverSocket = [
	'postMessage',
	'updateActiveUsers',
	'updateTypingUsers',
	'updateMessage'
];
const link = split(
	({ query }) => {
		const { kind, operation, selectionSet }: IDefinition = getMainDefinition(
			query
		);
		return (
			(kind === 'OperationDefinition' && operation === 'subscription') ||
			mutationsOverSocket.includes(getApolloOperationName(selectionSet))
		);
	},
	webSocketLink(),
	authLink.concat(apolloError).concat(httpLink)
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData
});
const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
	link,
	cache,
	resolvers
});
cache.writeData(initialState);

if (process.env.NODE_ENV === 'development') {
	window.apolloClient = client;
}

export default client;
