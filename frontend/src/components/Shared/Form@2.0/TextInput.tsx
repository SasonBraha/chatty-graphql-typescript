import React from 'react';
import styled from 'styled-components/macro';
import { Field } from 'formik';
import Icon from '../Icon';

interface IProps {
	name: string;
	type?: string;
	placeholder?: string;
	label: string;
	required?: boolean;
	icon: string;
	className?: string;
}

const TextInput: React.FC<IProps> = props => {
	const { name, type, placeholder, className, label, required, icon } = props;
	return (
		<Field name={name}>
			{({ field, meta }) => (
				<S.Container>
					<S.LabelAndRequiredContainer>
						<S.Label htmlFor={name}>{label}</S.Label>
						{required && <S.Required>*</S.Required>}
					</S.LabelAndRequiredContainer>

					<S.InputContainer>
						<S.Input
							type={type ? type : 'text'}
							placeholder={placeholder}
							className={className}
							id={name}
							{...field}
						/>
						{icon && <S.Icon icon={icon} width={20} height={20} />}
					</S.InputContainer>
					{meta.touched && meta.error && <S.Error>{meta.error}</S.Error>}
				</S.Container>
			)}
		</Field>
	);
};

const S: any = {};
S.Container = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
`;

S.LabelAndRequiredContainer = styled.div`
	display: flex;
	align-items: center;
`;

S.Label = styled.label`
	font-size: 1.4rem;
	margin-bottom: 2px;
	padding-right: 1px;
`;

S.Required = styled.small`
	color: red;
	margin-right: 3px;
`;

S.InputContainer = styled.div`
	position: relative;
`;

S.Input = styled.input(
	({ theme }) => `
	background: ${theme.gray30};
	outline: none;
	border: none;
	padding: 1rem 1rem 1rem 3rem;
	border-radius: .3rem;
	width: 100%;
`
);

S.Icon = styled(Icon)`
	position: absolute;
	left: 0.7rem;
	top: 50%;
	transform: translateY(-50%);
`;

S.Error = styled.small`
	font-size: 1.3rem;
	color: red;
	margin-top: 3px;
`;

export default TextInput;
