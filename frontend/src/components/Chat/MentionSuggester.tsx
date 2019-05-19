import React from 'react';
import { Transition } from 'react-transition-group';
import styled, { css } from 'styled-components/macro';
import { ListItem } from '../Shared';
import { IUser } from '../../types/interfaces';
import { connect } from 'react-redux';
import { IReducerState } from '../../redux/reducers';

interface IProps {
	shouldShow: boolean;
	userList: IUser[];
}

const MentionSuggester: React.FC<IProps> = props => {
	return (
		<Transition
			in={props.shouldShow && !!props.userList.length}
			mountOnEnter
			unmountOnExit
			timeout={{ enter: 0, exit: 300 }}
		>
			{mountState => (
				<ScMentionSuggester userList={props.userList} className={mountState}>
					<ul>
						{props.userList.map(user => (
							<ListItem
								linkTo={`/user/${user.slug}`}
								icon={''}
								key={user.slug}
								color='black'
							>
								{user.displayName}
							</ListItem>
						))}
					</ul>
				</ScMentionSuggester>
			)}
		</Transition>
	);
};

const ScMentionSuggester = styled('div')<{ userList: IUser[] }>`
	position: absolute;
	width: 100%;
	background: white;
	bottom: 5.4rem;
	right: 0;
	transition: 0.3s;
	box-shadow: 0 -0.3rem 0.4rem rgba(0, 0, 0, 0.07);
	transform: translateY(50%);
	opacity: 0;
	max-height: 0;

	${({ userList }) =>
		!!userList.length &&
		css`
			max-height: 1000px;
		`}

	&.entered {
		transform: translateY(0);
		opacity: 1;
		z-index: 2;
	}
`;

const mapStateToProps = ({
	chat: {
		mentionSuggester: { shouldShow, userList }
	}
}: IReducerState) => ({ shouldShow, userList });
export default connect(
	mapStateToProps,
	null
)(MentionSuggester);