import React from 'react';
import styled from 'styled-components/macro';
import ReactGoogleLogin from 'react-google-login';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { withApollo } from 'react-apollo';

interface IProps {
	client?: ApolloClient<any>;
}

const LOGIN_WITH_GOOGLE_MUATION = gql`
	mutation($token: String!) {
		loginWithGoogle(token: $token)
	}
`;

const GoogleLogin: React.FC<IProps> = props => {
	return (
		<ReactGoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			buttonText='Login'
			onFailure={console.log}
			onSuccess={async response => {
				const userAccessToken = await props.client!.mutate({
					mutation: LOGIN_WITH_GOOGLE_MUATION,
					variables: {
						//@ts-ignore
						token: response.Zi.id_token
					}
				});

				localStorage.setItem(
					process.env.REACT_APP_LS_AUTH_TOKEN,
					userAccessToken.data.loginWithGoogle
				);
				window.location.href = '/';
			}}
		/>
	);
};

export default withApollo(GoogleLogin);
