import React from 'react';
import styled from 'styled-components/macro';
import { CircleLoader, LineLoader } from '../../Shared/Loaders';

const RoomsListLoader = () => (
	<ScRoomsListLoader>
		<div>
			<CircleLoader height={3.7} width={3.7} />
		</div>

		<div>
			<LineLoader width={5} />
			<LineLoader height={1} />
		</div>
	</ScRoomsListLoader>
);

const ScRoomsListLoader = styled.div`
	display: flex;
	align-items: center;
`;

export default RoomsListLoader;
