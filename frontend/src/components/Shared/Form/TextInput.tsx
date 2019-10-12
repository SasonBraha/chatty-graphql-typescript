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

const TextInput: React.FC<IProps> = props => (
	<FormGroup>
		<S.Input id={props.name} {...props} required />
		<S.InputError>{props.error}</S.InputError>
		<S.Label htmlFor={props.name}>{props.label}</S.Label>
		<S.InputIcon>
			<use xlinkHref={`/images/sprite.svg#${props.icon}`} />
		</S.InputIcon>
	</FormGroup>
);

const S: any = {};
S.Input = styled('input')<{ error: string | undefined }>`
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

S.Label = styled.label`
	position: absolute;
	transition: 0.25s;
	cursor: text;
	user-select: none;
	color: #888;
	right: 0.1rem;
	top: 0;
	transition: 0.3s;
`;

S.InputIcon = styled.svg`
	position: absolute;
	transition: 0.3s;
	left: 0.4rem;
	top: -0.3rem;
	width: 2rem;
	height: 3rem;
`;

S.InputError = styled.div`
	color: ${props => props.theme.error};
	font-size: 1.25rem;
	text-align: right;
`;

export default TextInput;
