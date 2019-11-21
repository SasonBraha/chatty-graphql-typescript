import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useTransition, animated } from 'react-spring';
import { Tabs } from '../Shared';
import Recaptcha from 'react-google-recaptcha';
import {
	useLoginMutation,
	useRegisterMutation
} from '../../__generated__/graphql';

enum AuthScreens {
	LOGIN,
	REGISTER
}

interface IProps {}

export interface ICaptchaProps {
	execCaptcha: (formValues: { [key: string]: string }) => void;
	isExecutingMutation: boolean;
}

const Auth: React.FC<IProps> = props => {
	const [showRegister, setShowRegister] = useState(false);
	const [formValues, setFormValues] = useState({});
	const [isExecutingMutation, setExecutingMutation] = useState(false);
	const captchaRef: React.RefObject<any> = useRef();
	const [loginMutation] = useLoginMutation();
	const [registerMutation] = useRegisterMutation();

	const transitions = useTransition(showRegister, null, {
		from: { opacity: 0, width: '100%' },
		enter: { opacity: 1, width: '100%' },
		leave: { opacity: 0, width: '100%', position: 'absolute' }
	});

	const execCaptcha = formValues => {
		setFormValues(formValues);
		setExecutingMutation(true);
		captchaRef.current.execute();
	};

	useEffect(() => {
		captchaRef.current.reset();
	}, []);

	return (
		<S.Container>
			<S.RightColumn>
				<S.TabsContainer>
					<Tabs
						categories={['התחברות', 'הרשמה']}
						onIndexChange={index => {
							setShowRegister(index === AuthScreens.REGISTER);
						}}
					/>
				</S.TabsContainer>

				<S.FormsContainer>
					{transitions.map(({ item: showRegister, key, props }) =>
						showRegister ? (
							<animated.div key={key} style={props}>
								<RegisterForm
									isExecutingMutation={isExecutingMutation}
									execCaptcha={execCaptcha}
								/>
							</animated.div>
						) : (
							<animated.div key={key} style={props}>
								<LoginForm
									isExecutingMutation={isExecutingMutation}
									execCaptcha={execCaptcha}
								/>
							</animated.div>
						)
					)}
				</S.FormsContainer>
			</S.RightColumn>
			<S.LeftColumn>Chatty</S.LeftColumn>

			<Recaptcha
				ref={captchaRef}
				sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY}
				size='invisible'
				onChange={async () => {
					try {
						const captcha = captchaRef.current!.getValue();
						if (showRegister) {
							await registerMutation({
								// @ts-ignore
								variables: {
									...formValues,
									captcha
								}
							});
							setShowRegister(false);
						} else {
							loginMutation({
								// @ts-ignore
								variables: {
									...formValues
								}
							});
						}
					} catch (ex) {
					} finally {
						console.log('asdasd');
						setExecutingMutation(false);
					}
				}}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.div`
	display: flex;
	flex-direction: row;
	align-content: stretch;
	height: 100%;
`;

S.LeftColumn = styled.div`
	flex: 1;
	background: ${({ theme }) => theme.navBackground};
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 5rem;
`;

S.RightColumn = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

S.TabsContainer = styled.div`
	max-width: 23rem;
	width: 100%;
`;

S.FormsContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 46rem;
	position: relative;
	min-height: 24rem;
`;

export default Auth;
