import React from 'react';
import { connect } from 'react-redux';
import { IReducerState } from '../../redux/reducers';
import { ITypingUser, ITypingUsers } from '../../types/interfaces';

interface IProps {
	className?: string;
	typingUsers: ITypingUsers;
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

const TypingUsers = (props: IProps) => (
	<div className={props.className}>
		{renderTypingUsers(props.typingUsers[props.chatSlug])}
	</div>
);

const mapStateToProps = ({ chat: { typingUsers } }: IReducerState) => ({
	typingUsers
});
export default connect(
	mapStateToProps,
	null
)(TypingUsers);
