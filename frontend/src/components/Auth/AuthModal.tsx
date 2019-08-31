import React, { useState } from 'react';
import { Modal } from '../Shared';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useLocalCache } from '../Shared/Hooks';
import styled, { css } from 'styled-components/macro';

enum AuthModalDisplayState {
	login,
	register
}

interface IProps {}

const AuthModal: React.FC<IProps> = props => {
	const { showAuthModal } = useLocalCache(`
		showAuthModal
	`);
	const [currentDisplay, setCurrentDisplay] = useState<AuthModalDisplayState>(
		AuthModalDisplayState.login
	);

	return (
		<Modal isOpen={showAuthModal}>
			<S.ModalContentWrapper>
				<S.ModalContent
					style={{ transform: `translateX(${currentDisplay * 100}%)` }}
				>
					<LoginForm />

					<S.RegisterFormContainer>
						<RegisterForm />
					</S.RegisterFormContainer>
				</S.ModalContent>
			</S.ModalContentWrapper>

			<button
				onClick={() =>
					setCurrentDisplay(
						currentDisplay === AuthModalDisplayState.login
							? AuthModalDisplayState.register
							: AuthModalDisplayState.login
					)
				}
			>
				{currentDisplay === AuthModalDisplayState.login
					? 'אין לך חשבון? לחץ כאן להרשמה'
					: 'רשום? לחץ כאן להתחברות'}
			</button>
		</Modal>
	);
};

const S: any = {};
S.ModalContentWrapper = styled.div`
	overflow: hidden;
`;

S.ModalContent = styled.div`
	display: flex;
	overflow: visible;
	transition: 0.6s transform cubic-bezier(0.645, 0.045, 0.355, 1);

	& > * {
		flex: 0 0 100%;
	}
`;

S.RegisterFormContainer = styled.div`
	position: relative;
	overflow: hidden;

	.grecaptcha-badge {
		position: absolute !important;
		margin-top: 2rem;
	}
`;

export default AuthModal;
