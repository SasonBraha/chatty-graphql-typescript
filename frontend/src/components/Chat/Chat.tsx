import React from 'react';
import RoomsList from './RoomsList';
import styled from 'styled-components/macro';
import { Route, RouteComponentProps } from 'react-router';
import { withAuth } from '../Shared/Hoc';
import ActiveArea from './ActiveArea';

interface IProps extends RouteComponentProps {}
const Chat: React.FC<IProps> = props => {
	return (
		<S.Chat>
			<RoomsList />
			<Route
				exact
				path={`${props.match.path}/:chatSlug`}
				component={ActiveArea}
			/>
		</S.Chat>
	);
};

const S: any = {};
S.Chat = styled.div`
	display: grid;
	grid-template-columns: 25rem 5rem 1fr;
	height: 100%;
`;

S.MessagesArea = styled.div``;

export default withAuth(Chat);
