import React from 'react';
import { connect } from 'react-redux';
import { IReducerState } from '../../redux/reducers';
import styled from 'styled-components/macro';
import { ListItem } from '../Shared';

interface IProps {
	isNavOpen: boolean;
}

const navItems = [{ icon: 'icon-comments-o', to: '/chat', text: `צ'אט` }];

const Nav = (props: IProps) => (
	<ScNav isNavOpen={props.isNavOpen}>
		<ul>
			{navItems.map(({ icon, to, text }, i) => (
				<ListItem
					key={i}
					icon={icon}
					linkTo={to}
					hoverBackground='light'
					color='white'
					withRipple
				>
					{text}
				</ListItem>
			))}
		</ul>
	</ScNav>
);

const ScNav = styled('nav')<{ isNavOpen: boolean }>`
	width: ${props => props.theme.navWidth};
	background: ${props => props.theme.navBackground};
	transition: 0.5s cubic-bezier(0.6, 0.07, 0.07, 1.08);
	z-index: 1;
	transform: translateX(
		${({ isNavOpen, theme }) => (isNavOpen ? 0 : theme.navWidth)}
	);
	height: 100%;
`;

const mapStateToProps = ({ isNavOpen }: IReducerState) => ({ isNavOpen });
export default connect(
	mapStateToProps,
	null
)(Nav);
