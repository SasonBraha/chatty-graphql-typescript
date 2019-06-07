import React from 'react';
import styled, { css } from 'styled-components/macro';
import FormGroup from './FormGroup';

interface IProps {
	name: string;
	value: string;
	error: string | undefined;
	type?: string;
	label: string;
	icon?: string;
	onChange: (event: React.FormEvent<HTMLInputElement>) => void;
	onBlur: (event: React.FormEvent<HTMLInputElement>) => void;
}

const TextInput = (props: IProps) => (
	<FormGroup>
		<StyledInput id={props.name} {...props} required />
		<StyledInputError>{props.error}</StyledInputError>
		<StyledLabel htmlFor={props.name}>{props.label}</StyledLabel>
		<StyledInputIcon>
			<use xlinkHref={`/images/sprite.svg#${props.icon}`} />
		</StyledInputIcon>
	</FormGroup>
);

const StyledInput = styled('input')<{ error: string | undefined }>`
	border: none;
	background: white;
	border-bottom: 0.2rem solid #d4d4d4;
	display: block;
	padding: 0.5rem 0.2rem;
	outline: none;
	width: 100%;
	transition: 0.3s;
	font-family: inherit;
	font-size: 1.5rem;
	padding-left: 28px;

	&:focus,
	&:valid {
		border-color: ${props => props.theme.error};

		& ~ label,
		& ~ svg {
			color: ${props => props.theme.error};
			fill: ${props => props.theme.error};
		}

		& ~ label {
			font-size: 1.4rem;
			transform: translateY(-1.7rem);
		}
	}
	${({ error }) =>
		error &&
		css`
			border-color: ${props => props.theme.error};

			& ~ label,
			& ~ svg {
				color: ${props => props.theme.error};
				fill: ${props => props.theme.error};
			}
		`}
`;

const StyledLabel = styled.label`
	position: absolute;
	transition: 0.25s;
	cursor: text;
	user-select: none;
	color: #888;
	right: 0.1rem;
	top: 0;
	transition: 0.3s;
`;

const StyledInputIcon = styled.svg`
	position: absolute;
	transition: 0.3s;
	left: 0.4rem;
	top: -0.3rem;
	width: 2rem;
	height: 3rem;
`;

const StyledInputError = styled.div`
	color: ${props => props.theme.error};
	font-size: 1.25rem;
	text-align: right;
`;

export default TextInput;
