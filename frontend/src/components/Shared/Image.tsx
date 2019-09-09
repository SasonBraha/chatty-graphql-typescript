import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { getRuntimeImageDimensions } from '../../utils';

interface IProps {
	src: string;
	alt: string;
	className?: string;
	maxWidth?: number;
	maxHeight?: number;
	naturalWidth?: number;
	naturalHeight?: number;
	lazy?: boolean;
}

const Image: React.FC<IProps> = props => {
	const [isImageLoaded, setImageLoaded] = useState(false);
	const {
		maxWidth,
		maxHeight,
		naturalWidth,
		naturalHeight,
		lazy,
		...rest
	} = props;
	let runtimeWidth = null;
	let runtimeHeight = null;

	if (maxHeight && maxWidth && naturalWidth && naturalHeight) {
		const { width, height } = getRuntimeImageDimensions(
			maxWidth,
			maxHeight,
			naturalWidth,
			naturalHeight
		);
		runtimeWidth = width;
		runtimeHeight = height;
	}

	return (
		<S.ImageLoader
			style={{
				width: runtimeWidth ? runtimeWidth : '',
				height: runtimeHeight ? runtimeHeight : ''
			}}
			isImageLoaded={isImageLoaded}
		>
			<S.Image
				{...rest}
				loading={lazy ? 'lazy' : ''}
				onLoad={() => setImageLoaded(true)}
			/>
		</S.ImageLoader>
	);
};

const S: any = {};
S.ImageLoader = styled('div')<{ isImageLoaded: boolean }>`
	position: relative;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: white;
		opacity: 1;
		visibility: visible;
		transition: 0.3s;
		z-index: 1;
	}

	${({ isImageLoaded }) =>
		isImageLoaded &&
		css`
			&:before {
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
			}
		`}
`;

S.Image = styled.img``;

export default Image;
