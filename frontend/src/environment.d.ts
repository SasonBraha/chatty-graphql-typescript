export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			REACT_APP_GRAPHQL_URI: string;
			REACT_APP_GRAPHQL_SOCKET_URL: string;
			REACT_APP_LS_AUTH_TOKEN: string;
		}
	}
}
