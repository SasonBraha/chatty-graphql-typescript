import { ApolloClient } from 'apollo-client';

declare global {
	interface Window {
		apolloClient?: ApolloClient<any>;
	}
}
