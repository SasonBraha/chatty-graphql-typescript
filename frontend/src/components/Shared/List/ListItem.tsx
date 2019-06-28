import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import Ripple from 'react-ink';
import Icon from '../Icon';
import { IListItem } from './List';

interface IProps extends IListItem {}

const renderSymbol = (props: IProps) => {
	return props.icon ? (
		<StyledListIcon icon={props.icon} />
	) : (
		props.image && <ScListImage src={props.image} />
	);
};

const ListItem = (props: IProps) => (
	<StyledListItem
		hoverBackground={props.hoverBackground as string}
		color={props.color as string}
		isSelected={props.isSelected as boolean}
	>
		{props.linkTo ? (
			<Link className='ListItem' to={props.linkTo}>
				{renderSymbol(props)}
				{props.children ? props.children : props.text}
				{props.withRipple ? <Ripple /> : null}
			</Link>
		) : (
			<div className='ListItem' onClick={props.onClick}>
				{renderSymbol(props)}
				{props.children ? props.children : props.text}
				{props.withRipple ? <Ripple /> : null}
			</div>
		)}
	</StyledListItem>
);

ListItem.defaultProps = {
	hoverBackground: 'dark',
	color: ''
};

const StyledListItem = styled('li')<{
	hoverBackground: string;
	color: string;
	isSelected: boolean;
}>`
	position: relative;
	color: ${props => (props.color ? props.color : props.theme.gray10)};
	cursor: pointer;

	&:hover {
		background: ${({ hoverBackground }) =>
			hoverBackground === 'light'
				? 'rgba(255, 255, 255, .1)'
				: 'rgba(0, 0, 0, .1)'};
	}

	${({ isSelected }) =>
		isSelected &&
		css`
			background: rgba(0, 0, 0, 0.1);
		`}

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

const StyledListIcon = styled(Icon)`
	width: 2.7rem;
	height: 2.7rem;
	margin-left: 1rem;
`;

const ScListImage = styled.img`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	margin-left: 1rem;
`;

export default ListItem;
