import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import { RegisterForm } from './index';

interface IProps {}

const Auth: React.FC<IProps> = props => {
	return (
		<>
			{/*<LoginForm />*/}
			<RegisterForm />
		</>
	);
};

const S: any = {};
S.Container = styled.div``;

export default Auth;
