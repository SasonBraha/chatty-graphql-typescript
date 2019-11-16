import React from 'react';
import styled from 'styled-components';

interface IProps {}

const FormGroup: React.FC<IProps> = props => {
	return <div>Hello from FormGroup</div>;
};

const S: any = {};
S.Container = styled.div``;

export default FormGroup;
