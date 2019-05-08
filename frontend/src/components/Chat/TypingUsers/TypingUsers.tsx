import React, { useEffect, useState } from 'react';
import { CrudEnum } from '../../../types/enums';
import { connect } from 'react-redux';
import { setTypingUsers } from '../../../redux/actions';
import { IReducerState } from '../../../redux/reducers';
import { ITypingUser } from '../../../types/interfaces';

interface IProps {
	loading: boolean;
	className?: string;
	data: {
		user: ITypingUser;
		crudType: string;
	};
	setTypingUsers: typeof setTypingUsers;
	typingUsers: ITypingUser[];
}

// prettier-ignore
const renderTypingUsers = (typingUsers: ITypingUser[]) => {
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
};

const TypingUsers = (props: IProps) => {
	useEffect(() => {
		if (!props.loading) {
			props.setTypingUsers(props.data.user, props.data.crudType);
		}
	}, [props.data]);

	return (
		<div className={props.className}>
			{renderTypingUsers(props.typingUsers)}
		</div>
	);
};

const mapStateToProps = ({ chat: { typingUsers } }: IReducerState) => ({
	typingUsers
});
export default connect(
	mapStateToProps,
	{ setTypingUsers }
)(TypingUsers);
