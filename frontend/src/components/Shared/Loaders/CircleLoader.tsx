import React from 'react';
import styled from 'styled-components';
import LoadingShimmer from './LoadingShimmer';

interface IProps {
	width?: number;
	height?: number;
}

const CircleLoader = (props: IProps) => <ScCircleLoader {...props} />;

const ScCircleLoader = styled(LoadingShimmer)<IProps>`
	width: ${({ width }) => (width ? `${width}rem` : '2rem')};
	height: ${({ height }) => (height ? `${height}rem` : '2rem')};
	border-radius: 50%;
	position: relative;
`;

export default CircleLoader;
