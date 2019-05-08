import React, { useEffect, useState } from 'react';
import { CrudEnum } from '../../../types/enums';

interface ITypingUser {
	displayName: string;
	slug: string;
}

interface IProps {
	loading: boolean;
	data: {
		user: ITypingUser;
		crudType: string;
	};
}

const renderTypingUsers = (typingUsers: ITypingUser[]) => {
	const typingUsersLength: number = typingUsers.length;
	switch (true) {
		case typingUsersLength === 1: {
			const [user] = typingUsers;
			return <span>{user.displayName} מקליד...</span>;
		}

		case typingUsersLength === 2: {
			const [firstUser, secondUser] = typingUsers;
			return (
				<span>
					{firstUser.displayName} ו־{secondUser.displayName} מקלידים...
				</span>
			);
		}

		case typingUsersLength > 2: {
			const [firstUser, ...rest] = typingUsers;
			return (
				<span>
					{firstUser.displayName} ו־{rest.length} משתמשים נוספים מקלידים...
				</span>
			);
		}
	}
};

const UserTyping = (props: IProps) => {
	const [typingUsers, setTypingUsers] = useState<ITypingUser[]>([
		{ displayName: 'מנחפ', slug: 'asdasd' },
		{ displayName: 'asd', slug: 'asdasasdad' }
	]);

	useEffect(() => {
		if (!props.loading) {
			setTypingUsers(
				props.data.crudType === CrudEnum.UPDATE
					? [...typingUsers, props.data.user]
					: typingUsers.filter(({ slug }) => slug !== props.data.user.slug)
			);
		}
	}, [props.data]);

	return <div>{renderTypingUsers(typingUsers)}</div>;
};

export default UserTyping;
