import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Ripple from 'react-ink';

interface IProps {
	icon: string;
	linkTo?: string;
	hoverBackground: string;
	color: string;
	onClick?: () => void;
	withRipple?: boolean;
	children?: ReactNode;
}

const generateIcon = (icon: string) => (
	<StyledListIcon>
		<use xlinkHref={`./images/sprite.svg#${icon}`} />
	</StyledListIcon>
);

const ListItem = (props: IProps) => (
	<StyledListItem hoverBackground={props.hoverBackground} color={props.color}>
		{props.linkTo ? (
			<Link className='ListItem' to={props.linkTo}>
				{generateIcon(props.icon)}
				{props.children}
				{props.withRipple ? <Ripple /> : null}
			</Link>
		) : (
			<div className='ListItem' onClick={props.onClick}>
				{generateIcon(props.icon)}
				{props.children}
				{props.withRipple ? <Ripple /> : null}
			</div>
		)}
	</StyledListItem>
);

ListItem.defaultProps = {
	hoverBackground: 'dark',
	color: ''
};

const StyledListItem = styled('li')<{ hoverBackground: string; color: string }>`
	transition: 0.3s;
	position: relative;
	color: ${props => (props.color ? props.color : props.theme.gray10)};
	cursor: pointer;

	&:hover {
		background: ${({ hoverBackground }) =>
			hoverBackground === 'light'
				? 'rgba(255, 255, 255, .1)'
				: 'rgba(0, 0, 0, .1)'};
	}

	.ListItem {
		display: flex;
		align-items: center;
		padding: 0.9rem 1rem 0.9rem 0;
		position: relative;

		svg {
			fill: currentColor;
		}
	}
`;

const StyledListIcon = styled.svg`
	width: 2.7rem;
	height: 2.7rem;
	margin-left: 1rem;
`;

export default ListItem;
