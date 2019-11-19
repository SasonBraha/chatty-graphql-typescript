import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import LoginForm from './LoginForm';
import { RegisterForm } from './index';
import { useTransition, animated } from 'react-spring';
import { Tabs } from '../Shared';

interface IProps {}
const Auth: React.FC<IProps> = props => {
	const [showRegister, setShowRegister] = useState(false);

	const transitions = useTransition(showRegister, null, {
		from: { position: 'absolute', opacity: 0, width: '100%' },
		enter: { opacity: 1 },
		leave: { opacity: 0 }
	});

	return (
		<S.Container>
			<S.RightColumn>
				<S.FormsContainer>
					<Tabs categories={['Login', 'Register']} />
					{transitions.map(({ item: showRegister, key, props }) =>
						showRegister ? (
							<animated.div key={key} style={props}>
								<RegisterForm />
							</animated.div>
						) : (
							<animated.div key={key} style={props}>
								<LoginForm />
							</animated.div>
						)
					)}
				</S.FormsContainer>
			</S.RightColumn>
			<S.LeftColumn>Chatty</S.LeftColumn>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.div`
	display: flex;
	flex-direction: row;
	align-content: stretch;
	height: 100%;
`;

S.LeftColumn = styled.div`
	flex: 1;
	background: ${({ theme }) => theme.navBackground};
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 5rem;
`;

S.RightColumn = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

S.FormsContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 46rem;
	position: relative;
`;

export default Auth;
