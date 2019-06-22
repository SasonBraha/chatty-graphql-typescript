import React from 'react';
import { Modal } from '../Shared';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useLocalCache } from '../Shared/Hooks';

interface IProps {}

const AuthModal: React.FC<IProps> = props => {
	const { showAuthModal } = useLocalCache(`
		showAuthModal
	`);

	return (
		<Modal isOpen={showAuthModal}>
			<LoginForm />
			<RegisterForm />
		</Modal>
	);
};

export default AuthModal;
