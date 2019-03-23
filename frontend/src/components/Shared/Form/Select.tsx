import React, { ReactNode } from 'react';
import styled from 'styled-components';
import FormGroup from './FormGroup';

interface IProps {
	children: ReactNode;
}

const Select = (props: IProps) => (
	<FormGroup>
		<StyledSelect>{props.children}</StyledSelect>
	</FormGroup>
);

const StyledSelect = styled.select`
	width: 100%;
	padding: 0.9rem 0;
	border: none;
	border-radius: 0.3rem;
	font-size: 1.5rem;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
	outline: none;
	transition: 0.3s;
	cursor: pointer;
`;

export default Select;
