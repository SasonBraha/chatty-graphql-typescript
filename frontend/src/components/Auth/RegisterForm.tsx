import React from 'react';
import { Modal, Button } from '../Shared';
import { connect } from 'react-redux';
import { withFormik, FormikProps } from 'formik';
import { compose, graphql } from 'react-apollo';
import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';

const REGISTER_MUTATION = gql`
	mutation($displayName: String!, $email: String!, $password: String!) {
		register(
			data: { displayName: $displayName, email: $email, password: $password }
		)
	}
`;

interface IFormValues {
	displayName: string;
	email: string;
	password: string;
}

const LoginForm = (props: FormikProps<IFormValues>) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		isSubmitting
	} = props;
	return (
		<Form onSubmit={handleSubmit} icon={'icon-user-circle-o'} header='הרשמה'>
			<FormGroup>
				<TextInput
					name='displayName'
					value={values.displayName}
					error=''
					label='שם משתמש'
					onChange={handleChange}
					onBlur={handleBlur}
					icon='icon-user'
				/>
			</FormGroup>

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

export default compose(
	graphql(REGISTER_MUTATION),
	withFormik({
		mapPropsToValues: () => ({ displayName: '', email: '', password: '' }),
		handleSubmit: async (
			values,
			//@ts-ignore
			{ props: { mutate }, setSubmitting, resetForm }
		) => {
			const registerData = await mutate({
				variables: values
			});

			const {
				data: { registerMutation: isRegistered }
			} = registerData;

			if (isRegistered) {
				console.log('Success! Registered successfully');
			}
		}
	})
)(LoginForm);
