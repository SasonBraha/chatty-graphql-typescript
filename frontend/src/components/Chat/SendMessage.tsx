import React, { Ref, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { FormikProps } from 'formik';
import Icon from '../Shared/Icon';
import { RouteComponentProps } from 'react-router';
import { FileInput } from '../Shared/Form';
import { CrudEnum, KeyCodeEnum } from '../../types/enums';
import { InputTrigger } from '../Shared';
import MentionSuggester from './MentionSuggester';
import { useTranslation } from 'react-i18next';
import {
	use_SetMentionSuggesterMutation,
	useGetUsersLazyQuery,
	usePostMessageMutation,
	UserInput,
	useUpdateTypingUsersMutation,
	useUploadMessageFileMutation
} from '../../__generated__/graphql';
import { Form, TextInput } from '../Shared/Form@2.0';

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
const SendMessage2: React.FC<IProps> = props => {
	const [postMessage] = usePostMessageMutation();
	const [updateTypingUsers] = useUpdateTypingUsersMutation();
	const [uploadFile] = useUploadMessageFileMutation();
	const [
		executeUserSearch,
		{ data: userData, loading }
	] = useGetUsersLazyQuery();
	const [setMentionSuggester] = use_SetMentionSuggesterMutation();
	const { t } = useTranslation();
	const mentionSuggesterRef: Ref<any> = useRef(null);
	let isTyping = useRef(false).current;
	const formRef = useRef(null);

	const handleChange = useCallback(() => {
		if (isTyping) {
			clearTimeout(emitTypingTimeout);
			emitTypingTimeout = setTimeout(() => {
				updateTypingUsers({
					variables: {
						chatSlug: props.match.params.chatSlug,
						crudType: CrudEnum.DELETE
					}
				});
				isTyping = false;
			}, 450);
		} else {
			isTyping = true;
			updateTypingUsers({
				variables: {
					chatSlug: props.match.params.chatSlug,
					crudType: CrudEnum.UPDATE
				}
			});
			handleChange();
		}
	}, []);

	const handleSubmit = useCallback(async formValues => {
		const newMessage = await postMessage({
			variables: {
				...formValues,
				chatSlug: props.match.params.chatSlug
			}
		});

		formRef.current.resetForm();
		// setFilePreview(null);
		//
		// if (values.file) {
		// 	client.mutate({
		// 		mutation: UPLOAD_FILE_MUTATION,
		// 		variables: {
		// 			file: values.file,
		// 			chatSlug: match.params.chatSlug,
		// 			messageId: newMessage.data.postMessage._id
		// 		}
		// 	});
		// }
	}, []);

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

	return (
		<Form
			initialValues={{ file: null, text: '' }}
			onSubmit={handleSubmit}
			ref={formRef}
		>
			<S.Container>
				<S.AttachLabel>
					<FileInput
						maxFileSizeInKB={5000}
						onChange={(file: File | null) => {}}
					/>
					<S.AttachIcon icon='icon-paperclip' />
				</S.AttachLabel>

				<S.InputTrigger
					triggerSymbol='@'
					typeCallbackDebounce={200}
					onType={data => {
						console.log(data);
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
					<TextInput
						name='text'
						placeholder={t('chat.sendMessageInputPlaceholder')}
						onChange={handleChange}
						autoComplete='off'
						onKeyDown={e => {
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
					>
						{({ inputProps, meta }) => <S.MessageInput {...inputProps} />}
					</TextInput>
				</S.InputTrigger>

				<MentionSuggester
					onSelect={(text: string) => {
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
			</S.Container>
		</Form>
	);
};

const S: any = {};
S.Container = styled.div`
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

export default React.memo(SendMessage2);
