import React from 'react';
import styled from 'styled-components/macro';
import gql from 'graphql-tag';
import { withFormik, FormikProps } from 'formik';
import { compose, graphql } from 'react-apollo';
import Icon from '../Shared/Icon';
import { RouteComponentProps } from 'react-router';
import { withApollo } from 'react-apollo';
import { FileInput } from '../Shared/Form';

const SEND_MESSAGE_MUTATION = gql`
	mutation($chatSlug: String!, $text: String!) {
		postMessage(text: $text, chatSlug: $chatSlug) {
			_id
		}
	}
`;

const UPLOAD_FILE_MUTATION = gql`
	mutation($file: Upload!, $chatSlug: String!, $messageId: String!) {
		uploadMessageFile(file: $file, chatSlug: $chatSlug, messageId: $messageId)
	}
`;

interface IFormValues {
	text: string;
	file: string;
}

interface IMatchParams {
	chatSlug?: string;
}

interface IProps
	extends FormikProps<IFormValues>,
		RouteComponentProps<IMatchParams> {
	setFilePreview: (file: File | null) => void;
}

const SendMessage = (props: IProps) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		isSubmitting,
		setFieldValue,
		setFilePreview
	} = props;

	return (
		<ScForm onSubmit={handleSubmit}>
			<ScAttachLabel>
				<FileInput
					maxFileSize={5000}
					onChange={(file: File | null) => {
						setFilePreview(file);
						setFieldValue('file', file);
					}}
					onBlur={handleBlur}
				/>
				<ScAttachIcon icon='icon-paperclip' />
			</ScAttachLabel>

			<ScMessageInput
				autoComplete='off'
				type='text'
				value={values.text}
				name='text'
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
	z-index: 2;
`;

const ScAttachLabel = styled.label`
	cursor: pointer;
	input[type='file'] {
		display: none;
	}
`;

const ScAttachIcon = styled(Icon)`
	width: 2.5rem;
	height: 2.5rem;
	position: absolute;
	right: 0.7rem;
	top: 1.3rem;
`;

const ScMessageInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	background: linear-gradient(to left, #eee, white);
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
	font-size: 1.6rem;
	padding: 1.6rem 4rem 1.6rem 1.6rem;
	text-overflow: ellipsis;
`;

export default compose(
	graphql(SEND_MESSAGE_MUTATION, { name: 'sendMessage' }),
	graphql(UPLOAD_FILE_MUTATION, { name: 'uploadFile' }),
	withFormik({
		mapPropsToValues: () => ({ text: '', file: '' }),
		handleSubmit: async (
			values,
			//@ts-ignore
			{ props: { sendMessage, uploadFile, match }, resetForm }
		) => {
			// Send Message
			const newMessage = await sendMessage({
				variables: {
					...values,
					chatSlug: match.params.chatSlug
				}
			});

			resetForm();

			// Upload File
			if (values.file) {
				uploadFile({
					variables: {
						file: values.file,
						chatSlug: match.params.chatSlug,
						messageId: newMessage.data.postMessage._id
					}
				});
			}
		}
	})
)(SendMessage);
