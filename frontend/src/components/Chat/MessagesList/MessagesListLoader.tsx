import React from 'react';
import styled from 'styled-components/macro';
import { LoadingShimmer } from '../../Shared';

const MessagesListLoader = () => (
	<ScMessagesListLoader randomInt={Math.round(Math.random())} />
);

const ScMessagesListLoader = styled(LoadingShimmer)<{ randomInt: number }>`
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	width: 25rem;
	height: 6.8rem;
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	margin-top: 0.9rem;
	align-self: ${({ randomInt }) =>
		randomInt > 0.5 ? 'flex-start' : 'flex-end'};
`;

export default MessagesListLoader;
