import React from 'react';
import { ITypingUser } from '../../types/interfaces';
import { useLocalCache } from '../Shared/Hooks';

interface IProps {
	className?: string;
	chatSlug: string;
}

// prettier-ignore
const renderTypingUsers = (typingUsers: ITypingUser[]) => {
	if (typingUsers) {
		const typingUsersLength: number = typingUsers.length;
		switch (true) {
			case typingUsersLength === 1: {
				const [user] = typingUsers;
				return `${user.displayName} מקליד...`;
			}

			case typingUsersLength === 2: {
				const [firstUser, secondUser] = typingUsers;
				return `${firstUser.displayName} ו־${secondUser.displayName} מקלידים...`;
			}

			case typingUsersLength > 2: {
				const [firstUser, ...rest] = typingUsers;
				return `${firstUser.displayName} ו־${rest.length} משתמשים נוספים מקלידים...`;
			}
		}
	}

};

const TypingUsers = (props: IProps) => {
	const {
		chat: { typingUsers }
	} = useLocalCache(`
		chat { 
			typingUsers 
		}
	`);

	return (
		<div className={props.className}>
			{renderTypingUsers(typingUsers[props.chatSlug])}
		</div>
	);
};

export default TypingUsers;
