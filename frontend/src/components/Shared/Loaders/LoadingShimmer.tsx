import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

interface IProps {
	className?: string;
}

const LoadingShimmer = (props: IProps) => <ScLoadingShimmer {...props} />;

const LoadingShimmerEffect = keyframes` 
 		0% { background-position: 1px 0 }
    100%{ background-position: 800px 0 }
`;

const ScLoadingShimmer = styled.div`
	animation: 1s ${LoadingShimmerEffect} forwards infinite linear;
	background: linear-gradient(to right, #f6f6f6 8%, #d1d1d1 18%, #f6f6f6 33%);
	background-size: 800px 104px;
	flex-shrink: 0;
`;

export default LoadingShimmer;
