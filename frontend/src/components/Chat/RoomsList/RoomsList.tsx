import React from 'react';
import RoomsListItem from './RoomsListItem';
import styled from 'styled-components/macro';
import RoomsListLoader from './RoomsListLoader';
import {
	use_GetCurrentChatSlugQuery,
	use_SetTypingUsersMutation,
	useGetRoomsListQuery,
	useTypingUsersUpdatesSubscription
} from '../../../__generated__/graphql';

interface IProps {}

const RoomsList: React.FC<IProps> = props => {
	const { data, loading } = useGetRoomsListQuery();
	const {
		data: { currentChatSlug }
	} = use_GetCurrentChatSlugQuery();
	const [setTypingUsers] = use_SetTypingUsersMutation();

	useTypingUsersUpdatesSubscription({
		onSubscriptionData({ subscriptionData }) {
			const {
				data: {
					onTypingUsersUpdate: {
						chatSlug,
						crudType,
						user: { displayName }
					}
				}
			} = subscriptionData;
			setTypingUsers({
				variables: {
					chatSlug,
					crudType,
					displayName
				}
			});
		}
	});

	return (
		<S.RoomsList>
			{loading
				? Array.from({ length: 15 }).map((_, i) => <RoomsListLoader key={i} />)
				: data.roomsList.map(room => (
						<RoomsListItem
							selected={room.slug === currentChatSlug}
							room={room}
							key={room.slug}
							chatSlug={room.slug}
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
