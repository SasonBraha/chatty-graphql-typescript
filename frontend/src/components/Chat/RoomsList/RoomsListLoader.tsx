import React from 'react';
import styled from 'styled-components/macro';
import { LoadingShimmer } from '../../Shared';

const RoomsListLoader = () => (
	<S.RoomsListLoader>
		<S.RoomImage />

		<S.Text>
			<S.RoomName />
			<S.RoomLastMessage />
		</S.Text>
	</S.RoomsListLoader>
);

const S: any = {};
S.RoomsListLoader = styled.div`
	display: flex;
	align-items: center;
	padding: 1rem;
	background: ${props => props.theme.activeUsersBackground};
	margin: 1rem;
`;

S.RoomImage = styled(LoadingShimmer)`
	width: 3.7rem;
	height: 3.7rem;
	border-radius: 50%;
`;

S.Text = styled.div`
	margin-right: 10px;
`;

S.RoomName = styled(LoadingShimmer)`
	height: 1.2rem;
	width: 7rem;
`;

S.RoomLastMessage = styled(LoadingShimmer)`
	height: 0.8rem;
	margin-top: 0.3rem;
	width: 5.3rem;
`;

export default RoomsListLoader;
