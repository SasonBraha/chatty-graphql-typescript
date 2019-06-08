import React from 'react';
import styled from 'styled-components/macro';
import ReactGoogleLogin from 'react-google-login';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { withApollo } from 'react-apollo';

interface IProps {
	client?: ApolloClient<any>;
	text: string;
}

const LOGIN_WITH_GOOGLE_MUTATION = gql`
	mutation($token: String!) {
		loginWithGoogle(token: $token)
	}
`;

const GoogleLogin: React.FC<IProps> = props => {
	return (
		<ReactGoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			render={renderProps => (
				<ScGoogleLoginBtn {...renderProps}>
					{props.text}
					<ScGoogleLogo src='./images/google_logo.svg' alt='google_logo' />
				</ScGoogleLoginBtn>
			)}
			onFailure={() => null}
			onSuccess={async response => {
				const userAccessToken = await props.client!.mutate({
					mutation: LOGIN_WITH_GOOGLE_MUTATION,
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

const ScGoogleLoginBtn = styled.button`
	border: none;
	padding: 1.2rem 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.3rem;
	background: white;
	cursor: pointer;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
	margin: 0.5rem 0;
	outline: none;
	transition: 0.2s;
	letter-spacing: 0.05rem;
	color: #757575;

	&:active {
		background: ${props => props.theme.gray30};
	}
`;

const ScGoogleLogo = styled.img`
	margin-right: 1rem;
`;

export default withApollo(GoogleLogin);
