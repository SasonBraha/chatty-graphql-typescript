import React from 'react';
import styled from 'styled-components/macro';
import gql from 'graphql-tag';
import { withFormik, FormikProps } from 'formik';
import { compose, graphql } from 'react-apollo';

const SEND_MESSAGE_MUTATION = gql`
	mutation($message: String!, $file: Upload, $chatId: String!) {
		loginMutation(message: $message, file: $file, chatId: $chatId)
	}
`;

interface IFormValues {
	message: string;
	file: string;
}

const SendMessage = (props: FormikProps<IFormValues>) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		isSubmitting,
		setFieldValue
	} = props;

	return (
		<form onSubmit={handleSubmit}>
			<ScAttachFile>
				<input
					type='file'
					name='file'
					onChange={e => setFieldValue('file', e.target.files[0])}
					onBlur={handleBlur}
				/>
				File
			</ScAttachFile>

			<input
				type='text'
				value={values.message}
				name='message'
				onChange={handleChange}
				onBlur={handleBlur}
			/>

			<button>Submit</button>
		</form>
	);
};

const ScAttachFile = styled.label`
	input[type='file'] {
		display: none;
	}
`;

export default compose(
	graphql(SEND_MESSAGE_MUTATION),
	withFormik({
		mapPropsToValues: () => ({ message: '', file: '' }),
		handleSubmit(values) {
			console.log(values);
		}
		// handleSubmit: async (
		// 	values,
		// 	//@ts-ignore
		// 	{ props: { mutate }, setSubmitting, resetForm }
		// ) => {
		// 	const sendMessageData = await mutate({
		// 		variables: values
		// 	});
		// 	const {
		// 		data: { sendMessageMutation: authToken }
		// 	} = sendMessageData;
		// }
	})
)(SendMessage);
