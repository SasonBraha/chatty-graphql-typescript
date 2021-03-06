import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';

interface IProps {
	isOpen: boolean;
	children?: ReactNode;
	closeFn?: () => any;
}

const Modal: React.FC<IProps> = props => {
	const { isOpen, children, closeFn } = props;

	return ReactDOM.createPortal(
		<Transition
			in={isOpen}
			mountOnEnter
			unmountOnExit
			timeout={{ enter: 0, exit: 300 }}
		>
			{mountState => (
				<S.Overlay
					onClick={(e: React.MouseEvent) => {
						if (typeof closeFn === 'function' && e.target === e.currentTarget) {
							closeFn();
						}
					}}
					className={mountState}
				>
					<S.Container>{children}</S.Container>
				</S.Overlay>
			)}
		</Transition>,
		document.getElementById('modalMount')!
	);
};

const S: any = {};
S.Container = styled.div`
	background: white;
	box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);
	padding: 3rem;
	width: 100%;
	max-width: 70rem;
	border-radius: 0.5rem;
	text-align: center;
	transition: 0.3s;
	transform: scale(0.9) translateY(10rem);
	opacity: 0;
	overflow-y: auto;
	max-height: 95vh;
`;

S.Overlay = styled.div`
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.25);
	width: 100%;
	height: 100%;
	z-index: 20;
	top: 0;
	left: 0;
	padding: 1rem;
	opacity: 0;
	transition: 0.3s;

	&.entered {
		opacity: 1;

		${S.Container} {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
`;

export default Modal;
