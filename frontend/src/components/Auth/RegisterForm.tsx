import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Shared';
import { FormikProps, withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';
import Recaptcha from 'react-google-recaptcha';
import { setGenericModal } from '../../redux/actions';
import { connect } from 'react-redux';

const REGISTER_MUTATION = gql`
	mutation(
		$displayName: String!
		$email: String!
		$password: String!
		$captcha: String!
	) {
		register(
			data: {
				displayName: $displayName
				email: $email
				password: $password
				captcha: $captcha
			}
		)
	}
`;

interface IFormValues {
	displayName: string;
	email: string;
	password: string;
	captcha: string;
}

const LoginForm = (props: FormikProps<IFormValues>) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		setFieldValue,
		handleBlur,
		handleSubmit,
		isSubmitting
	} = props;
	let captchaRef: React.RefObject<any> = useRef();

	useEffect(() => {
		captchaRef.current.execute();
	}, []);

	return (
		<>
			<Form onSubmit={handleSubmit} icon={'icon-user-circle-o'} header='הרשמה'>
				<FormGroup>
					<TextInput
						name='displayName'
						value={values.displayName}
						error={errors.displayName}
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
						error={errors.email}
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
						error={errors.password}
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

			<Recaptcha
				ref={captchaRef}
				sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
				size='invisible'
				onChange={() => {
					setFieldValue('captcha', captchaRef.current!.getValue());
				}}
			/>
		</>
	);
};

export default compose(
	graphql(REGISTER_MUTATION),
	withFormik({
		mapPropsToValues: () => ({
			displayName: '',
			email: '',
			password: '',
			captcha: ''
		}),
		handleSubmit: async (
			values,
			//@ts-ignore
			{ props: { mutate }, setSubmitting, resetForm, setErrors }
		) => {
			try {
				const registerData = await mutate({
					variables: values
				});
				const {
					data: { registerMutation: isRegistered }
				} = registerData;

				if (isRegistered) {
					console.log('Success! Registered successfully');
				}
			} catch (ex) {
				const { message, status, formValidation } = ex.graphQLErrors[0];
				if (formValidation.captcha) {
					console.log('אימות');
				} else {
					setErrors(formValidation);
				}
			}
		}
	})
)(
	connect(
		null,
		{ setGenericModal }
	)(LoginForm)
);
