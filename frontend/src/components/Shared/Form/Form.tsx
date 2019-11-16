import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';

interface IProps {
	header: string;
	icon: string;
	children: ReactNode;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<IProps> = props => (
	<S.Form onSubmit={props.onSubmit} noValidate>
		<S.FormHeader>
			<S.FormHeaderIcon>
				<use xlinkHref={`/images/sprite.svg#${props.icon}`} />
			</S.FormHeaderIcon>
			{props.header}
		</S.FormHeader>
		{props.children}
	</S.Form>
);

const S: any = {};
S.Form = styled.form`
	margin: 0 auto;

	@media (max-width: 700px) {
		max-width: 100%;
	}
`;

S.FormHeader = styled.header`
	font-size: 3rem;
	letter-spacing: -0.1rem;
	text-align: center;
	font-weight: 300;
	color: #343434;
	line-height: 2rem;
	text-transform: capitalize;

	&::after {
		content: '';
		display: block;
		margin: 1.5rem auto 3.3rem auto;
		width: 73%;
		height: 0.2rem;
		background: var(--main-color);
	}
`;

S.FormHeaderIcon = styled.svg`
	width: 9rem;
	height: 9rem;
	color: currentColor;
	display: block;
	fill: currentColor;
	margin: 0 auto 5px auto;
`;

export default Form;
