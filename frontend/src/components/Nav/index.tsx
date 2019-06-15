import React from 'react';
import { connect } from 'react-redux';
import { IReducerState } from '../../redux/reducers';
import styled from 'styled-components/macro';
import { List } from '../Shared';
import { useLocalCache } from '../Shared/Hooks';

interface IProps {
	isNavOpen: boolean;
}

const navItems = [
	{
		icon: 'icon-comments-o',
		linkTo: '/chat',
		text: `צ'אט`,
		color: 'white',
		withRipple: true,
		hoverBackground: 'light'
	}
];

const Nav = (props: IProps) => {
	const { isNavOpen } = useLocalCache('isNavOpen');
	return (
		<ScNav isNavOpen={isNavOpen}>
			<List items={navItems} />
		</ScNav>
	);
};

const ScNav = styled('nav')<{ isNavOpen: boolean }>`
	width: ${props => props.theme.navWidth};
	background: ${props => props.theme.navBackground};
	transition: 0.5s cubic-bezier(0.6, 0.07, 0.07, 1.08);
	z-index: 1;
	position: fixed;
	box-shadow: -0.2rem 0.3rem 0.4rem rgba(0, 0, 0, 0.2);

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
