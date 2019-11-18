import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import { RegisterForm } from './index';
import { useTransition, animated } from 'react-spring';
import { generateUniqueId } from '../../utils';

interface IProps {}

enum DisplayEnum {
	LOGIN,
	REGISTER
}

const screens = [LoginForm, RegisterForm];

// @ts-ignore
const Auth: React.FC<IProps> = props => {
	const [toggle, set] = useState(false);
	const transitions = useTransition(toggle, null, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 }
	});

	useEffect(() => {
		setInterval(() => {
			set(pr => !pr);
		}, 2500);
	}, []);

	return transitions.map(({ item, key, props }) =>
		item ? (
			<animated.div key={key} style={props}>
				<LoginForm />
			</animated.div>
		) : (
			<animated.div key={key} style={props}>
				<RegisterForm />
			</animated.div>
		)
	);
};

const S: any = {};
S.Container = styled.div``;

export default Auth;
