import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';

interface IProps {
	children: ReactNode;
}

const FormGroup: React.FC<IProps> = props => (
	<S.FormGroup>{props.children}</S.FormGroup>
);

const S: any = {};
S.FormGroup = styled.div`
	position: relative;
	margin-bottom: 3.3rem;
	flex: 1;
`;

export default FormGroup;
