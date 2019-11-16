import React from 'react';
import { Button, GoogleLogin } from '../Shared';
import { FormikProps, withFormik } from 'formik';
// import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';
import client from '../../apollo/client';
import { useTranslation } from 'react-i18next';
import { Form, TextInput } from '../Shared/Form@2.0';

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
			<button>Sumbit</button>
		</Form>
	);
};

// const LoginForm = (props: FormikProps<IFormValues>) => {
// 	const { values, handleChange, handleBlur, handleSubmit } = props;
// 	const { t } = useTranslation();
// 	return (
// 		<Form onSubmit={handleSubmit} icon={'icon-user-circle-o'} header='התחברות'>
// 			<GoogleLogin text={t('global.forms.loginOrRegisterWithGoogle')} />
// 			<FormGroup>
// 				<TextInput
// 					name='email'
// 					value={values.email}
// 					error=''
// 					label={t('global.forms.email')}
// 					onChange={handleChange}
// 					onBlur={handleBlur}
// 					icon='icon-envelope'
// 				/>
// 			</FormGroup>
//
// 			<FormGroup>
// 				<TextInput
// 					name='password'
// 					type='password'
// 					value={values.password}
// 					error=''
// 					label={t('global.forms.password')}
// 					onChange={handleChange}
// 					onBlur={handleBlur}
// 					icon='icon-key'
// 				/>
// 			</FormGroup>
//
// 			<Button type='submit'>
// 				{t('global.forms.login')}
// 				<Ripple />
// 			</Button>
// 		</Form>
// 	);
// };
//
// export default withFormik({
// 	mapPropsToValues: () => ({ email: '', password: '' }),
// 	handleSubmit: async (
// 		values,
// 		//@ts-ignore
// 		{ props: { mutate }, setSubmitting, resetForm }
// 	) => {
// 		try {
// 			const loginData = await client.mutate({
// 				mutation: LOGIN_MUTATION,
// 				variables: values
// 			});
// 			const {
// 				data: { login: authToken }
// 			} = loginData;
//
// 			if (authToken) {
// 				localStorage.setItem(process.env.REACT_APP_LS_AUTH_TOKEN, authToken);
// 				window.location.reload();
// 			}
// 		} catch (ex) {}
// 	}
// })(LoginForm);

export default _LoginForm;
