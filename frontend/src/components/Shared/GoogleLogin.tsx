import React from 'react';
import styled from 'styled-components/macro';
import ReactGoogleLogin from 'react-google-login';

const GoogleLogin = () => {
	return (
		<ReactGoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			buttonText='Login'
			onFailure={console.log}
			onSuccess={console.log}
		/>
	);
};

export default GoogleLogin;
