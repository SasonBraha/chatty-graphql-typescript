import React from 'react';
import { resetModals } from '../../../redux/actions';
import { connect } from 'react-redux';
import { IReducerState } from '../../../redux/reducers';
import { Modal } from '../index';
import Icon from '../Icon';
import styled from 'styled-components/macro';

interface IProps {
	resetModals: typeof resetModals;
	showModal: boolean;
	text: string | null;
}

const ErrorModal = (props: IProps) => (
	<Modal isOpen={props.showModal}>
		<ScWarningIcon icon='icon-notification' />
		<ScWarningText>{props.text}</ScWarningText>
	</Modal>
);

const ScWarningIcon = styled(Icon)`
	fill: #f8bb86;
	width: 8rem;
	height: 8rem;
	display: block;
	margin: 0 auto;
`;

const ScWarningText = styled.div`
	font-size: 1.7rem;
	margin: 2rem auto;
`;

const mapStateToProps = ({ genericModal: { show, text } }: IReducerState) => ({
	showModal: show,
	text
});
export default connect(
	mapStateToProps,
	{ resetModals }
)(ErrorModal);
