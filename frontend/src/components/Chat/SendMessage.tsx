import React, { Ref, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import gql from 'graphql-tag';
import { FormikProps, withFormik } from 'formik';
import Icon from '../Shared/Icon';
import { RouteComponentProps } from 'react-router';
import { FileInput } from '../Shared/Form';
import ApolloClient from 'apollo-client';
import { CrudEnum, KeyCodeEnum } from '../../types/enums';
import { InputTrigger } from '../Shared';
import MentionSuggester from './MentionSuggester';
import { useApolloClient } from '@apollo/react-hooks';
import client from '../../apollo/client';
import { useTranslation } from 'react-i18next';
import {
	use_SetMentionSuggesterMutation,
	useGetUsersLazyQuery,
	UserInput
} from '../../__generated__/graphql';

const SEND_MESSAGE_MUTATION = gql`
	mutation PostMessage($chatSlug: String!, $text: String!) {
		postMessage(text: $text, chatSlug: $chatSlug) {
			_id
		}
	}
`;

const UPLOAD_FILE_MUTATION = gql`
	mutation UploadMessageFile(
		$file: Upload!
		$chatSlug: String!
		$messageId: String!
	) {
		uploadMessageFile(file: $file, chatSlug: $chatSlug, messageId: $messageId)
	}
`;

const UPDATE_TYPING_USERS = gql`
	mutation UpdateTypingUsers($chatSlug: String!, $crudType: String!) {
		updateTypingUsers(chatSlug: $chatSlug, crudType: $crudType)
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

let emitTypingTimeout: ReturnType<typeof setTimeout>;
const handleChange = (
	isTyping: boolean,
	setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
	props: IProps,
	value: string,
	client: ApolloClient<any>
) => {
	if (isTyping) {
		clearTimeout(emitTypingTimeout);
		emitTypingTimeout = setTimeout(() => {
			client.mutate({
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
		client.mutate({
			mutation: UPDATE_TYPING_USERS,
			variables: {
				chatSlug: props.match.params.chatSlug,
				crudType: CrudEnum.UPDATE
			}
		});
		handleChange(true, setIsTyping, props, value, client);
	}
};

const SendMessage: React.FC<IProps> = props => {
	const [isTyping, setIsTyping] = useState(false);
	const client = useApolloClient();
	const mentionSuggesterRef: Ref<any> = useRef(null);
	const [
		executeUserSearch,
		{ data: userData, loading }
	] = useGetUsersLazyQuery();
	const { t } = useTranslation();
	const [setMentionSuggester] = use_SetMentionSuggesterMutation();

	useEffect(() => {
		if (!loading && userData) {
			const { userList } = userData.users;
			setMentionSuggester({
				variables: {
					data: {
						show: userList.length > 0,
						userList: userList as UserInput[]
					}
				}
			});
		}
	}, [userData, loading]);

	const {
		values,
		handleChange: handleFormikChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
		setFilePreview
	} = props;

	return (
		<S.Form onSubmit={handleSubmit}>
			<S.AttachLabel>
				<FileInput
					maxFileSizeInKB={5000}
					onChange={(file: File | null) => {
						setFilePreview(file);
						setFieldValue('file', file);
					}}
					onBlur={handleBlur}
				/>
				<S.AttachIcon icon='icon-paperclip' />
			</S.AttachLabel>

			<S.InputTrigger
				triggerSymbol='@'
				typeCallbackDebounce={200}
				onType={data => {
					executeUserSearch({
						variables: {
							displayName: data.value,
							limit: 5
						}
					});
				}}
				onCancel={() => {
					setMentionSuggester({
						variables: {
							data: {
								userList: [],
								show: false
							}
						}
					});
				}}
			>
				<S.MessageInput
					autoComplete='off'
					type='text'
					value={values.text}
					name='text'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						handleFormikChange(e);
						handleChange(isTyping, setIsTyping, props, values.text, client);
					}}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (mentionSuggesterRef.current) {
							const { key } = e;
							if (
								![
									KeyCodeEnum.ARROW_DOWN,
									KeyCodeEnum.ARROW_UP,
									KeyCodeEnum.ENTER
								].includes(key as KeyCodeEnum)
							)
								return;
							e.preventDefault();

							mentionSuggesterRef.current!.dispatchEvent(
								new KeyboardEvent('keydown', {
									key,
									bubbles: true
								})
							);
						}
					}}
					onBlur={handleBlur}
					placeholder={t('chat.sendMessageInputPlaceholder')}
				/>
			</S.InputTrigger>

			<MentionSuggester
				onSelect={(text: string) => {
					setFieldValue('text', `${values.text}${text}`);
					setMentionSuggester({
						variables: {
							data: {
								userList: [],
								show: false
							}
						}
					});
				}}
				ref={mentionSuggesterRef}
			/>
		</S.Form>
	);
};

const S: any = {};

S.Form = styled.form`
	flex: 0 0;
	display: flex;
	justify-content: space-between;
	position: relative;
	z-index: 2;
`;

S.AttachLabel = styled.label`
	cursor: pointer;
	input[type='file'] {
		display: none;
	}
`;

S.AttachIcon = styled(Icon)`
	width: 2.5rem;
	height: 2.5rem;
	position: absolute;
	right: 0.7rem;
	top: 1.3rem;
`;

S.MessageInput = styled.input`
	width: 100%;
	border: none;
	outline: none;
	background: linear-gradient(to left, #eee, white);
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
	font-size: 1.6rem;
	padding: 1.6rem 4rem 1.6rem 1.6rem;
	cursor: text;
`;

S.InputTrigger = styled(InputTrigger)`
	flex: 1;
`;

export default withFormik({
	mapPropsToValues: () => ({ text: '', file: '' }),
	handleSubmit: async (
		values: IFormValues,
		//@ts-ignore
		{ props: { sendMessage, uploadFile, match, setFilePreview }, resetForm }
	) => {
		const newMessage = await client.mutate({
			mutation: SEND_MESSAGE_MUTATION,
			variables: {
				...values,
				chatSlug: match.params.chatSlug
			}
		});

		resetForm();
		setFilePreview(null);

		if (values.file) {
			client.mutate({
				mutation: UPLOAD_FILE_MUTATION,
				variables: {
					file: values.file,
					chatSlug: match.params.chatSlug,
					messageId: newMessage.data.postMessage._id
				}
			});
		}
	}
})(SendMessage);
