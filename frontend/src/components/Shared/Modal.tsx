import React, { useEffect, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import { resetModals } from '../../redux/actions';

interface IProps {
	isOpen: boolean;
	children?: ReactNode;
	resetModals: typeof resetModals;
}

const Modal = (props: IProps) => {
	const { isOpen, resetModals, children } = props;

	// useEffect(() => {
	// 	isOpen
	// 		? document.body.addEventListener('click', resetModals)
	// 		: document.body.removeEventListener('click', resetModals);
	// }, [isOpen]);

	return ReactDOM.createPortal(
		<Transition
			in={props.isOpen}
			mountOnEnter
			unmountOnExit
			timeout={{ enter: 0, exit: 300 }}
		>
			{mountState => (
				<StyledOverlay className={mountState}>
					<StyledContainer>{children}</StyledContainer>
				</StyledOverlay>
			)}
		</Transition>,
		document.getElementById('modalMount') as HTMLElement
	);
};

const StyledContainer = styled.div`
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

const StyledOverlay = styled.div`
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

		${StyledContainer} {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
`;

export default connect(
	null,
	{ resetModals }
)(Modal);
