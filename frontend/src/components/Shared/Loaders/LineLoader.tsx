import React from 'react';
import styled from 'styled-components';
import LoadingShimmer from './LoadingShimmer';

interface IProps {
	width?: number;
	height?: number;
}

const LineLoader = (props: IProps) => <ScLineLoader {...props} />;

const ScLineLoader = styled(LoadingShimmer)<IProps>`
	width: ${({ width }) => (width ? `${width}rem` : '5rem')};
	height: ${({ height }) => (height ? `${height}rem` : '1rem')};
	position: relative;
`;

export default LineLoader;
