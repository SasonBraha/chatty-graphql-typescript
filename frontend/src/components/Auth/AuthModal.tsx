import React from 'react';
import { Modal, Button } from '../Shared';
import { connect } from 'react-redux';
import { withFormik, FormikProps } from 'formik';
import { compose, graphql } from 'react-apollo';
import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';
import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
	mutation($email: String!, $password: String!) {
		loginMutation(email: $email, password: $password)
	}
`;

interface IProps {
	showAuthModal: boolean;
}

interface IFormValues {
	email: string;
	password: string;
}

const AuthModal = (props: IProps & FormikProps<IFormValues>) => {
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
		<Modal isOpen={props.showAuthModal}>
			<Form
				onSubmit={handleSubmit}
				icon={'icon-user-circle-o'}
				header='התחברות'
			>
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

					<TextInput
						name='password'
						value={values.password}
						error=''
						label='סיסמה'
						onChange={handleChange}
						onBlur={handleBlur}
						icon='icon-key'
					/>

					<Button type='submit'>
						התחבר
						<Ripple />
					</Button>
				</FormGroup>
			</Form>
		</Modal>
	);
};

const mapStateToProps = ({ showAuthModal }: { showAuthModal: boolean }) => ({
	showAuthModal
});
export default connect(
	mapStateToProps,
	null
)(
	compose(
		graphql(LOGIN_MUTATION),
		withFormik({
			mapPropsToValues: () => ({ email: '', password: '' }),
			handleSubmit: async (
				values,
				//@ts-ignore
				{ props: { mutate }, setSubmitting, resetForm }
			) => {
				const loginData = await mutate({
					variables: values
				});
				const {
					data: { loginMutation: authToken }
				} = loginData;
				if (authToken) {
					localStorage.setItem(process.env.REACT_APP_LS_AUTH_TOKEN, authToken);
				}
			}
		})
	)(AuthModal)
);
