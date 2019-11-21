import React from 'react';
import { Button, GoogleLogin } from '../Shared';
import { useTranslation } from 'react-i18next';
import { Form, TextInput } from '../Shared/Form@2.0';
import styled from 'styled-components';
import { ICaptchaProps } from './Auth';
import { useLoginMutation } from '../../__generated__/graphql';

interface IProps extends ICaptchaProps {}

const LoginForm: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const [execLogin] = useLoginMutation();

	return (
		<S.Container>
			<GoogleLogin text={t('global.forms.loginOrRegisterWithGoogle')} />
			<Form
				initialValues={{
					email: '',
					password: ''
				}}
				onSubmit={async args => {
					props.execCaptcha(args);
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

				<S.ForgotAndSubmitContainer>
					<S.ForgotPassword>שכחת סיסמה?</S.ForgotPassword>
					<Button text={t('global.forms.login')} type='submit' />
				</S.ForgotAndSubmitContainer>
			</Form>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.div`
	max-width: 700px;
	align-self: center;
`;

S.ForgotAndSubmitContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 1rem;
	overflow: hidden;
`;

S.ForgotPassword = styled.small`
	text-decoration: underline;
	cursor: pointer;
`;

export default LoginForm;
