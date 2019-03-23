import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
	children: ReactNode;
}

const FormGroup = (props: IProps) => (
	<StyledFormGroup>{props.children}</StyledFormGroup>
);

const StyledFormGroup = styled.div`
	position: relative;
	margin-bottom: 3.3rem;
	flex: 1;
`;

export default FormGroup;
