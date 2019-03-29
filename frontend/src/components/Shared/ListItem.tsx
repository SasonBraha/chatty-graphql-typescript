import React, { ReactNode } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Ripple from 'react-ink';

interface IProps {
	icon: string;
	linkTo?: string;
	hoverBackground: string;
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
	<StyledListItem hoverBackground={props.hoverBackground}>
		{props.linkTo ? (
			<Link className='ListItem' to={props.linkTo}>
				{generateIcon(props.icon)}
				{props.children}
			</Link>
		) : (
			<div className='ListItem' onClick={props.onClick}>
				{generateIcon(props.icon)}
				{props.children}
			</div>
		)}
		{props.withRipple ? <Ripple /> : null}
	</StyledListItem>
);

ListItem.defaultProps = {
	hoverBackground: 'dark'
};

const StyledListItem = styled('li')<{ hoverBackground: string }>`
	transition: 0.3s;
	position: relative;
	color: ${props => props.theme.gray10};

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
