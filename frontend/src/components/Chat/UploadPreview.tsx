import React from 'react';
import styled from 'styled-components/macro';
import Transition from 'react-transition-group/Transition';

interface IProps {
	file: File | null;
}

const UploadPreview = (props: IProps) => {
	return (
		<Transition
			in={!!props.file}
			mountOnEnter
			unmountOnExit
			timeout={{ enter: 0, exit: 300 }}
		>
			{mountState =>
				props.file ? (
					<ScUploadPreview className={mountState}>
						<ScImage
							src={URL.createObjectURL(props.file)}
							alt={props.file!.name}
							title={props.file!.name}
						/>
					</ScUploadPreview>
				) : null
			}
		</Transition>
	);
};

const ScImage = styled.img`
	max-height: 70%;
	max-width: 70%;
	border: 0.1rem solid ${props => props.theme.gray30};
	transition: 0.3s;
	transition-delay: 0.2s;
	opacity: 0;
	transform: scale(0.8);
	border-radius: 50%;
`;

const ScUploadPreview = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: calc(100% - 54px);
	width: 100%;
	background: linear-gradient(to left, #eee, white);
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transform: translateY(-100%);
	transition: 0.3s cubic-bezier(0.77, 0, 0.175, 1);

	&.entered {
		transform: translateY(0);

		${ScImage} {
			opacity: 1;
			transform: scale(1);
			border-radius: 0.4rem;
		}
	}
`;

export default UploadPreview;
