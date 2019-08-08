import React from 'react';
import { Button, GoogleLogin } from '../Shared';
import { FormikProps, withFormik } from 'formik';
import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';
import client from '../../apollo/client';

const LOGIN_MUTATION = gql`
	mutation($email: String!, $password: String!) {
		login(data: { email: $email, password: $password })
	}
`;

interface IFormValues {
	email: string;
	password: string;
}

const LoginForm = (props: FormikProps<IFormValues>) => {
	const { values, handleChange, handleBlur, handleSubmit } = props;
	return (
		<Form onSubmit={handleSubmit} icon={'icon-user-circle-o'} header='התחברות'>
			<GoogleLogin text='התחבר באמצעות Google' />
			<FormGroup>
				<TextInput
					name='email'
					value={values.email}
					error=''
					label='דואר אלקטרוני'
					onChange={handleChange}
					onBlur={handleBlur}
					icon='icon-envelope'
				/>
			</FormGroup>

			<FormGroup>
				<TextInput
					name='password'
					type='password'
					value={values.password}
					error=''
					label='סיסמה'
					onChange={handleChange}
					onBlur={handleBlur}
					icon='icon-key'
				/>
			</FormGroup>

			<Button type='submit'>
				התחבר
				<Ripple />
			</Button>
		</Form>
	);
};

export default withFormik({
	mapPropsToValues: () => ({ email: '', password: '' }),
	handleSubmit: async (
		values,
		//@ts-ignore
		{ props: { mutate }, setSubmitting, resetForm }
	) => {
		try {
			const loginData = await client.mutate({
				mutation: LOGIN_MUTATION,
				variables: values
			});
			const {
				data: { login: authToken }
			} = loginData;

			if (authToken) {
				localStorage.setItem(process.env.REACT_APP_LS_AUTH_TOKEN, authToken);
				window.location.reload();
			}
		} catch (ex) {}
	}
})(LoginForm);
