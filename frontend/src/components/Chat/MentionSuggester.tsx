import React, { Ref } from 'react';
import { Transition } from 'react-transition-group';
import styled, { css } from 'styled-components/macro';
import { List } from '../Shared';
import { IListItem } from '../Shared/List/List';
import {
	use_GetMentionSuggesterQuery,
	User
} from '../../__generated__/graphql';

interface IProps {
	onSelect?: (value: string) => any | void;
	ref?: Ref<any>;
}

const MentionSuggester: React.FC<IProps> = React.forwardRef(
	(props: IProps, ref: Ref<any>) => {
		const {
			data: {
				mentionSuggester: { userList, show }
			}
		} = use_GetMentionSuggesterQuery();

		return (
			<Transition
				in={show}
				mountOnEnter
				unmountOnExit
				timeout={{ enter: 0, exit: 300 }}
			>
				{mountState => (
					<S.MentionSuggester userList={userList} className={mountState}>
						<List
							items={userList.reduce((acc: IListItem[], currentUser: User) => {
								acc.push({
									image: currentUser.avatar,
									color: 'black',
									text: currentUser.displayName
								});
								return acc;
							}, [])}
							onSelect={props.onSelect}
							withKeyboardNavigation
							ref={ref!}
						/>
					</S.MentionSuggester>
				)}
			</Transition>
		);
	}
);

const S: any = {};
S.MentionSuggester = styled('div')<{ userList: User[] }>`
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

export default MentionSuggester;
