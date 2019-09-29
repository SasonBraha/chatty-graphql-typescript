import React from 'react';
import { Modal } from '../index';
import Icon from '../Icon';
import styled from 'styled-components/macro';
import {
	use_GetGenericModalQuery,
	use_SetGenericModalMutation
} from '../../../__generated__/graphql';

interface IProps {}

const ErrorModal: React.FC<IProps> = props => {
	const {
		data: {
			genericModal: { show, text }
		}
	} = use_GetGenericModalQuery();
	const [setGenericModal] = use_SetGenericModalMutation();
	return (
		<Modal
			isOpen={show}
			closeFn={() => setGenericModal({ variables: { data: { show: false } } })}
		>
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
