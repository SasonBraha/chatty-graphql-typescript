import React from 'react';
import styled from 'styled-components/macro';
import ReactGoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { useLoginWithGoogleMutation } from '../../__generated__/graphql';

interface IProps {
	text: string;
}

const GoogleLogin: React.FC<IProps> = props => {
	const [loginMutation] = useLoginWithGoogleMutation();
	return (
		<ReactGoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			render={renderProps => (
				<S.GoogleLoginBtn {...renderProps}>
					{props.text}
					<S.GoogleLogo src='./images/google_logo.svg' alt='google_logo' />
				</S.GoogleLoginBtn>
			)}
			onFailure={console.log}
			onSuccess={async (response: GoogleLoginResponse) => {
				const { data } = await loginMutation({
					variables: {
						token: response.getAuthResponse().id_token
					}
				});

				localStorage.setItem(
					process.env.REACT_APP_LS_AUTH_TOKEN,
					data.loginWithGoogle
				);
				window.location.href = '/';
			}}
		/>
	);
};

const S: any = {};
S.GoogleLoginBtn = styled.button`
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

S.GoogleLogo = styled.img`
	margin-right: 1rem;
`;

export default GoogleLogin;
