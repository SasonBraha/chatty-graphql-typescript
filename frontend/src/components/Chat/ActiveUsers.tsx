import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IUser } from '../../types/interfaces';
import { Link } from 'react-router-dom';
import { CrudEnum } from '../../types/enums';
import { afterRender } from '../../utils';
import {
	use_GetCurrentChatSlugQuery,
	useActiveUsersUpdatesSubscription,
	useUpdateActiveUsersMutation
} from '../../__generated__/graphql';

interface IProps {}

const ActiveUsers: React.FC<IProps> = props => {
	const {
		data: { currentChatSlug: chatSlug }
	} = use_GetCurrentChatSlugQuery();
	const [previousSlug, setPreviousSlug] = useState(chatSlug);
	const {
		data = { onActiveUsersUpdate: [] }
	} = useActiveUsersUpdatesSubscription({
		variables: { chatSlug }
	});
	const [updateActiveUsers] = useUpdateActiveUsersMutation();

	useEffect(() => {
		updateActiveUsers({
			variables: {
				chatSlug: previousSlug,
				crudType: CrudEnum.DELETE
			}
		});
		afterRender(() => {
			updateActiveUsers({
				variables: {
					chatSlug: chatSlug,
					crudType: CrudEnum.UPDATE
				}
			});
		});
		setPreviousSlug(chatSlug);

		return () =>
			updateActiveUsers({
				variables: {
					chatSlug: chatSlug,
					crudType: CrudEnum.DELETE
				}
			});
	}, [chatSlug]);

	return (
		<S.ActiveUsers>
			{data.onActiveUsersUpdate.map((user: IUser, i: number) => (
				<Link to={`/user/${user.slug}`} key={i}>
					<S.ActiveUser>
						<S.Avatar src={user.avatar} alt={user.displayName} />
					</S.ActiveUser>
				</Link>
			))}
		</S.ActiveUsers>
	);
};

const S: any = {};
S.ActiveUsers = styled.div`
	text-align: center;
	background: ${props => props.theme.activeUsersBackground};
	padding: 0.5rem;
	overflow-y: auto;
	overflow-x: hidden;
	transition: 0.25s;
	color: white;
	grid-column: 2 / 3;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

S.ActiveUser = styled.div`
	border-radius: 0.5rem;
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 0.6rem;

	&:after {
		content: '';
		position: absolute;
		display: block;
		bottom: 0;
		right: 0.1rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: ${props => props.theme.success};
	}
`;

S.Avatar = styled.img`
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	transform: translateY(0.2rem);
`;

export default ActiveUsers;
