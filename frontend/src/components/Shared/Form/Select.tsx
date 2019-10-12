import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import FormGroup from './FormGroup';

interface IProps {
	children: ReactNode;
}

const Select: React.FC<IProps> = props => (
	<FormGroup>
		<S.Select>{props.children}</S.Select>
	</FormGroup>
);

const S: any = {};
S.Select = styled.select`
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
