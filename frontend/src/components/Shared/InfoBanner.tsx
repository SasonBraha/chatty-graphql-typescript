import React from 'react';
import styled from 'styled-components/macro';

interface IProps {
	type: 'info' | 'warning' | 'error' | 'success';
	text: string;
}

const InfoBanner: React.FC<IProps> = props => {
	return <ScInfoBanner type={props.type}>{props.text}</ScInfoBanner>;
};

const ScInfoBanner = styled('div')<{ type: string }>`
	width: 100%;
	padding: 1rem;
	text-align: center;
	margin: 0 0 1rem auto;
	// @ts-ignore
	background: ${({ theme, type }) => theme[type]};
	color: white;
	border-radius: 0.5rem;
`;

export default InfoBanner;
