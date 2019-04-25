import React from 'react';
import styled from 'styled-components/macro';
import { LoadingShimmer } from '../../Shared';

const RoomsListLoader = () => (
	<ScRoomsListLoader>
		<ScRoomImage />

		<ScText>
			<ScRoomName />
			<ScRoomLastMessage />
		</ScText>
	</ScRoomsListLoader>
);

const ScRoomsListLoader = styled.div`
	display: flex;
	align-items: center;
	padding: 1rem;
	background: ${props => props.theme.activeUsersBackground};
	margin-bottom: 0.5rem;
`;

const ScRoomImage = styled(LoadingShimmer)`
	width: 3.7rem;
	height: 3.7rem;
	border-radius: 50%;
`;

const ScText = styled.div`
	margin-right: 10px;
`;

const ScRoomName = styled(LoadingShimmer)`
	height: 1.2rem;
	width: 7rem;
`;

const ScRoomLastMessage = styled(LoadingShimmer)`
	height: 0.8rem;
	margin-top: 0.3rem;
	width: 5.3rem;
`;

export default RoomsListLoader;
