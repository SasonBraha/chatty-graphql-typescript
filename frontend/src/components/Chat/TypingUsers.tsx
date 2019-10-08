import React from 'react';

interface IProps {
	className?: string;
	chatSlug: string;
	users: string[];
}

const renderTypingUsers = (typingUsers: string[]) => {
	if (typingUsers) {
		const typingUsersLength: number = typingUsers.length;
		switch (true) {
			case typingUsersLength === 1: {
				const [user] = typingUsers;
				return `${user} מקליד...`;
			}

			case typingUsersLength === 2: {
				const [firstUser, secondUser] = typingUsers;
				return `${firstUser} ו־${secondUser} מקלידים...`;
			}

			case typingUsersLength > 2: {
				const [firstUser, ...rest] = typingUsers;
				return `${firstUser} ו־${rest.length} משתמשים נוספים מקלידים...`;
			}
		}
	}
};

const TypingUsers: React.FC<IProps> = props => {
	return (
		<div className={props.className}>{renderTypingUsers(props.users)}</div>
	);
};

export default TypingUsers;
