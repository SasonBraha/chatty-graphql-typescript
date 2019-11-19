import React, { useRef } from 'react';
import { Button } from '../Shared';
import { Form, TextInput } from '../Shared/Form@2.0';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

interface IProps {}
const RegisterForm: React.FC<IProps> = () => {
	const { t } = useTranslation();
	const captchaRef: React.RefObject<any> = useRef();

	return (
		<S.Container>
			<Form
				initialValues={{
					displayName: '',
					email: '',
					password: '',
					captcha: ''
				}}
				onSubmit={args => {
					console.log(args);
				}}
			>
				<TextInput
					name='displayName'
					label={t('global.forms.displayName')}
					icon='icon-user'
				/>

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

				<Button text={t('global.forms.register')} type='submit' />
			</Form>
		</S.Container>
	);
};

{
	/*<Recaptcha*/
}
{
	/*	ref={captchaRef}*/
}
{
	/*	sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}*/
}
{
	/*	size='invisible'*/
}
{
	/*	onChange={() => {*/
}
{
	/*		setFieldValue('captcha', captchaRef.current!.getValue());*/
}
{
	/*	}}*/
}
{
	/*/>*/
}

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

export default RegisterForm;
