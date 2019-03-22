import React from 'react';
import { Modal, Button } from '../Shared';
import { connect } from 'react-redux';

interface IProps {
	showAuthModal: boolean;
}

const AuthModal = (props: IProps) => (
	<Modal isOpen={props.showAuthModal}>
		<div>Hello</div>
	</Modal>
);

const mapStateToProps = ({ showAuthModal }: { showAuthModal: boolean }) => ({
	showAuthModal
});
export default connect(
	mapStateToProps,
	null
)(AuthModal);
