import React from 'react';
import { Modal } from '../Shared';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface IProps {
	showAuthModal: boolean;
}

const AuthModal = (props: IProps) => {
	return (
		<Modal isOpen={props.showAuthModal}>
			<LoginForm />
			<RegisterForm />
		</Modal>
	);
};

const mapStateToProps = ({ showAuthModal }: { showAuthModal: boolean }) => ({
	showAuthModal
});
export default connect(
	mapStateToProps,
	null
)(AuthModal);
