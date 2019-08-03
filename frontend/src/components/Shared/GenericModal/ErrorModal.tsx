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
			<S.WarningIcon width={80} height={80} icon='icon-notification' />
			<S.WarningText>{text}</S.WarningText>
		</Modal>
	);
};

const S: any = {};
S.WarningIcon = styled(Icon)`
	fill: #f8bb86;
	width: 8rem;
	height: 8rem;
	display: block;
	margin: 0 auto;
`;

S.WarningText = styled.div`
	font-size: 1.7rem;
	margin: 2rem auto;
`;

export default ErrorModal;
