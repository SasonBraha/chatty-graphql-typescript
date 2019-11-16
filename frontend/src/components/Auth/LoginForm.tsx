import React from 'react';
import { Button, GoogleLogin } from '../Shared';
import { FormikProps, withFormik } from 'formik';
// import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';
import client from '../../apollo/client';
import { useTranslation } from 'react-i18next';
import { Form, TextInput } from '../Shared/Form@2.0';
import styled from 'styled-components';

const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(data: { email: $email, password: $password })
	}
`;

interface IFormValues {
	email: string;
	password: string;
}

interface IProps {}

const _LoginForm: React.FC<IProps> = props => {
	const { t } = useTranslation();

	return (
		<S.Container>
			<GoogleLogin text={t('global.forms.loginOrRegisterWithGoogle')} />
			<Form
				initialValues={{
					email: '',
					password: ''
				}}
				onSubmit={args => {
					console.log(args);
				}}
			>
				<TextInput
					name='email'
					type='email'
					label={t('global.forms.email')}
					icon='icon-envelope'
					required
				/>

				<TextInput
					name='password'
					type='password'
					label={t('global.forms.password')}
					icon='icon-key'
					required
				/>

				<S.ForgotAndSubmitContainer>
					<S.ForgotPassword>שכחת סיסמה?</S.ForgotPassword>
					<Button text={t('global.forms.login')} type='submit' />
				</S.ForgotAndSubmitContainer>
			</Form>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.div`
	max-width: 700px;
	align-self: center;
`;

S.ForgotAndSubmitContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 1rem;
	overflow: hidden;
`;

S.ForgotPassword = styled.small``;

export default _LoginForm;
