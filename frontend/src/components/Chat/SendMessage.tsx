import React from 'react';
import styled from 'styled-components/macro';
import gql from 'graphql-tag';
import { withFormik, FormikProps } from 'formik';
import { compose, graphql } from 'react-apollo';
import Icon from '../Shared/Icon';

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
		<ScForm onSubmit={handleSubmit}>
			<ScAttachLabel>
				<input
					type='file'
					name='file'
					onChange={e => setFieldValue('file', e.target.files![0])}
					onBlur={handleBlur}
				/>
				<ScAttachIcon icon='icon-paperclip' />
			</ScAttachLabel>

			<ScMessageInput
				autoComplete='off'
				type='text'
				value={values.message}
				name='message'
				onChange={handleChange}
				onBlur={handleBlur}
				placeholder='הכנס הודעה ולחץ Enter'
			/>
		</ScForm>
	);
};

const ScForm = styled.form`
	flex: 0 0;
	display: flex;
	justify-content: space-between;
	position: relative;
`;

const ScAttachLabel = styled.label`
	input[type='file'] {
		display: none;
	}
`;

const ScAttachIcon = styled(Icon)`
	width: 2.5rem;
	height: 2.5rem;
	position: absolute;
	right: 0.7rem;
	top: 1.1rem;
`;

const ScMessageInput = styled.input`
	flex: 1;
	padding: 1.4rem;
	border: none;
	outline: none;
	background: linear-gradient(to left, #eee, white);
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
	font-size: 1.6rem;
	padding-right: 4rem;
	text-overflow: ellipsis;
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
