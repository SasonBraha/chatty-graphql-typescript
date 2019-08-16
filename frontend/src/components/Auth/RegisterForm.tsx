import React, { useEffect, useRef } from 'react';
import { Button } from '../Shared';
import { FormikProps, withFormik } from 'formik';
import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';
import Recaptcha from 'react-google-recaptcha';
import client from '../../apollo/client';
import { useTranslation } from 'react-i18next';
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
		handleChange,
		setFieldValue,
		handleBlur,
		handleSubmit
	} = props;
	let captchaRef: React.RefObject<any> = useRef();
	const { t } = useTranslation();

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
						label={t('global.forms.displayName')}
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
						label={t('global.forms.email')}
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
						label={t('global.forms.password')}
						onChange={handleChange}
						onBlur={handleBlur}
						icon='icon-key'
					/>
				</FormGroup>

				<Button type='submit'>
					{t('global.forms.register')}
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

export default withFormik({
	mapPropsToValues: () => ({
		displayName: '',
		email: '',
		password: '',
		captcha: ''
	}),
	handleSubmit: async (
		values,
		//@ts-ignore
		{ props: { mutate }, setErrors }
	) => {
		try {
			const registerData = await client.mutate({
				mutation: REGISTER_MUTATION,
				variables: values
			});
			const {
				data: { registerMutation: isRegistered }
			} = registerData;

			if (isRegistered) {
				console.log('Success! Registered successfully');
			}
		} catch (ex) {
			const { formValidation } = ex.graphQLErrors[0];
			if (formValidation.captcha) {
				console.log('אימות');
			} else {
				setErrors(formValidation);
			}
		}
	}
})(LoginForm);
