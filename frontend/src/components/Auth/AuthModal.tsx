import React from 'react';
import { Modal, Button } from '../Shared';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
import { Form, FormGroup, TextInput } from '../Shared/Form';
import Ripple from 'react-ink';

interface IProps {
	showAuthModal: boolean;
}

const AuthModal = (props: IProps) => (
	<Modal isOpen={props.showAuthModal}>
		<Formik
			initialValues={{ email: '', password: '' }}
			//@ts-ignore
			onSubmit={(values, { isSubmitting }) => {
				console.log(values);
			}}
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting
			}) => (
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
			)}
		</Formik>
	</Modal>
);

const mapStateToProps = ({ showAuthModal }: { showAuthModal: boolean }) => ({
	showAuthModal
});
export default connect(
	mapStateToProps,
	null
)(AuthModal);
