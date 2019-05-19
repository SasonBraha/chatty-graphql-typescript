import React, { useState } from 'react';
import styled from 'styled-components/macro';
import gql from 'graphql-tag';
import { FormikProps, withFormik } from 'formik';
import { compose, graphql, withApollo } from 'react-apollo';
import Icon from '../Shared/Icon';
import { RouteComponentProps } from 'react-router';
import { FileInput } from '../Shared/Form';
import ApolloClient from 'apollo-client';
import { CrudEnum } from '../../types/enums';
import { InputTrigger } from '../Shared';
import { setMentionSuggester } from '../../redux/actions';
import { connect } from 'react-redux';

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

const UPDATE_TYPING_USERS = gql`
	mutation($chatSlug: String!, $crudType: String!) {
		updateTypingUsers(chatSlug: $chatSlug, crudType: $crudType)
	}
`;

const SEARCH_USERS_MUTATION = gql`
	mutation($limit: Int, $displayName: String!) {
		users(displayName: $displayName, limit: $limit) {
			searchToken
			userList {
				displayName
				slug
				avatar
			}
		}
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
	client: ApolloClient<any>;
	setMentionSuggester: typeof setMentionSuggester;
}

let emitTypingTimeout: ReturnType<typeof setTimeout>;
const handleChange = (
	isTyping: boolean,
	setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
	props: IProps,
	value: string
) => {
	// Manage Typing Auth
	if (isTyping) {
		clearTimeout(emitTypingTimeout);
		emitTypingTimeout = setTimeout(() => {
			props.client.mutate({
				mutation: UPDATE_TYPING_USERS,
				variables: {
					chatSlug: props.match.params.chatSlug,
					crudType: CrudEnum.DELETE
				}
			});
			setIsTyping(false);
		}, 450);
	} else {
		setIsTyping(true);
		props.client.mutate({
			mutation: UPDATE_TYPING_USERS,
			variables: {
				chatSlug: props.match.params.chatSlug,
				crudType: CrudEnum.UPDATE
			}
		});
		handleChange(true, setIsTyping, props, value);
	}
};

const SendMessage: React.FC<IProps> = props => {
	const [isTyping, setIsTyping] = useState(false);
	const {
		values,
		errors,
		touched,
		handleChange: handleFormikChange,
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

			<ScInputTrigger
				triggerSymbol='@'
				typeCallbackDebounceRate={400}
				onType={async data => {
					const userData = await props.client.mutate({
						mutation: SEARCH_USERS_MUTATION,
						variables: {
							displayName: data.value,
							limit: 5
						}
					});

					props.setMentionSuggester(true, userData.data.users.userList);
				}}
				onCancel={() => props.setMentionSuggester(false, [])}
			>
				<ScMessageInput
					autoComplete='off'
					type='text'
					value={values.text}
					name='text'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						handleFormikChange(e);
						handleChange(isTyping, setIsTyping, props, values.text);
					}}
					onBlur={handleBlur}
					placeholder='הכנס הודעה ולחץ Enter'
				/>
			</ScInputTrigger>
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
	width: 100%;
	border: none;
	outline: none;
	background: linear-gradient(to left, #eee, white);
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
	font-size: 1.6rem;
	padding: 1.6rem 4rem 1.6rem 1.6rem;
	text-overflow: ellipsis;
	cursor: text;
`;

const ScInputTrigger = styled(InputTrigger)`
	flex: 1;
`;

export default compose(
	graphql(SEND_MESSAGE_MUTATION, { name: 'sendMessage' }),
	graphql(UPLOAD_FILE_MUTATION, { name: 'uploadFile' }),
	withFormik({
		mapPropsToValues: () => ({ text: '', file: '' }),
		handleSubmit: async (
			values: IFormValues,
			//@ts-ignore
			{ props: { sendMessage, uploadFile, match, setFilePreview }, resetForm }
		) => {
			const newMessage = await sendMessage({
				variables: {
					...values,
					chatSlug: match.params.chatSlug
				}
			});

			resetForm();
			setFilePreview(null);

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
)(
	withApollo(
		connect(
			null,
			{ setMentionSuggester }
		)(SendMessage)
	)
);
