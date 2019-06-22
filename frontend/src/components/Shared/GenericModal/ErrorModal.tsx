import React from 'react';
import { Modal } from '../index';
import Icon from '../Icon';
import styled from 'styled-components/macro';
import { useLocalCache } from '../Hooks';

interface IProps {}

const ErrorModal = (props: IProps) => {
	const {
		genericModal: { show, text }
	} = useLocalCache(`
		genericModal {
			show
			text
		}
	`);
	return (
		<Modal isOpen={show}>
			<ScWarningIcon width={80} height={80} icon='icon-notification' />
			<ScWarningText>{text}</ScWarningText>
		</Modal>
	);
};

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

export default ErrorModal;
