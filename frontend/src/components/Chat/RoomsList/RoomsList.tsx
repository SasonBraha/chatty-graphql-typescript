import React from 'react';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';
import RoomsListLoader from './RoomsListLoader';
import { setTypingUsers } from '../../../apollo/actions';
import { useLocalCache } from '../../Shared/Hooks';
import {
	useGetRoomsListQuery,
	useTypingUsersUpdatesSubscription
} from '../../../__generated__/graphql';

interface IProps {}

const RoomsList: React.FC<IProps> = props => {
	const { data, loading } = useGetRoomsListQuery();
	const {
		chat: { chatSlug, typingUsers }
	} = useLocalCache(`
		chat {
			chatSlug
			typingUsers
		}
	`);

	useTypingUsersUpdatesSubscription({
		onSubscriptionData({ subscriptionData }) {
			const {
				data: {
					onTypingUsersUpdate: { chatSlug, crudType, user }
				}
			} = subscriptionData;
			setTypingUsers(user, crudType, chatSlug);
		}
	});

	return (
		<S.RoomsList>
			{loading
				? Array.from({ length: 15 }).map((_, i) => <RoomsListLoader key={i} />)
				: data &&
				  data.roomsList &&
				  data.roomsList.map(room => (
						<RoomsListItem
							selected={room.slug === chatSlug}
							room={room}
							key={room.slug}
							chatSlug={room.slug}
							typingUsers={typingUsers[room.slug] ? typingUsers[room.slug] : []}
						/>
				  ))}
		</S.RoomsList>
	);
};

const S: any = {};
S.RoomsList = styled.div`
	background: ${props => props.theme.roomsListBackground};
	grid-column: 1 / 2;
	overflow: hidden;

	&:hover {
		overflow-y: auto;
	}
`;

export default RoomsList;
