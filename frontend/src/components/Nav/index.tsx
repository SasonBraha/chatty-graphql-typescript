import React from 'react';
import styled from 'styled-components/macro';
import { List } from '../Shared';
import i18n from '../../locale/i18n';
import { use_GetNavStateQuery } from '../../__generated__/graphql';

interface IProps {}

const navItems = [
	{
		icon: 'icon-comments-o',
		linkTo: '/chat',
		text: i18n.t('nav.chat'),
		color: 'white',
		withRipple: true,
		hoverBackground: 'light'
	}
];

const Nav: React.FC<IProps> = props => {
	const {
		data: { isNavOpen }
	} = use_GetNavStateQuery();
	return (
		<S.Nav isNavOpen={isNavOpen}>
			<List items={navItems} />
		</S.Nav>
	);
};

const S: any = {};
S.Nav = styled('nav')<{ isNavOpen: boolean }>`
	width: ${props => props.theme.navWidth};
	background: ${props => props.theme.navBackground};
	transition: 0.5s cubic-bezier(0.6, 0.07, 0.07, 1.08);
	z-index: 1;
	position: fixed;
	box-shadow: -0.2rem 0.3rem 0.4rem rgba(0, 0, 0, 0.2);
	backface-visibility: hidden;

	transform: translateX(
		${({ isNavOpen, theme }) => (isNavOpen ? 0 : theme.navWidth)}
	);
	height: 100%;
`;

export default Nav;
