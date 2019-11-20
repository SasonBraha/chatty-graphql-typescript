import React, { useRef } from 'react';
import { Button } from '../Shared';
import { Form, TextInput } from '../Shared/Form@2.0';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { ICaptchaProps } from './Auth';

interface IProps extends ICaptchaProps {}
const RegisterForm: React.FC<IProps> = props => {
	const { t } = useTranslation();

	return (
		<S.Container>
			<Form
				initialValues={{
					displayName: '',
					email: '',
					password: ''
				}}
				onSubmit={async args => {
					console.log(args);
				}}
			>
				<TextInput
					name='displayName'
					label={t('global.forms.displayName')}
					icon='icon-user'
					required
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
