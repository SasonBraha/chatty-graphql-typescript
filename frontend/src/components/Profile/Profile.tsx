import React, { useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import formatRelative from 'date-fns/formatRelative';
import { parseISO } from 'date-fns';
import he from 'date-fns/locale/he';

const USER_QUERY = gql`
	query userQuery($slug: String!) {
		user(slug: $slug) {
			displayName
			avatar
			email
			createdAt
		}
	}
`;

interface IRouteParams {
	slug: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {}

const Profile: React.FC<IProps> = props => {
	const userSlug = props.match.params.slug;
	const { data, loading } = useQuery(USER_QUERY, {
		variables: { slug: userSlug }
	});
	return loading ? (
		<div>Loading...</div>
	) : (
		<ScProfile>
			<ScRightColumn>
				<ScContainer column>
					<ScProfileImage>
						<img
							src={data.user.avatar}
							alt={`תמונת הפרופיל של ${data.user.displayName}`}
						/>
					</ScProfileImage>
					<ScUsername>{data.user.displayName}</ScUsername>
				</ScContainer>
				<ScContainer row>
					<ScBold>תאריך הרשמה:</ScBold>
					{formatRelative(
						parseISO((data.user.createdAt as unknown) as string),
						new Date(),
						{
							locale: he
						}
					)}
				</ScContainer>
			</ScRightColumn>
			<ScLeftColumn></ScLeftColumn>
		</ScProfile>
	);
};

const ScProfile = styled.div`
	width: 100%;
	height: 100%;
	padding: 15px;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
`;

const ScRightColumn = styled.div`
	flex: 1;
`;
const ScContainer = styled('div')<{ column?: boolean; row?: boolean }>`
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	margin-bottom: 10px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;

	${({ column }) =>
		column &&
		css`
			flex-direction: column;
		`}
	${({ row }) =>
		row &&
		css`
			flex-direction: row;
		`}
`;
const ScProfileImage = styled.figure`
	img {
		width: 30rem;
		height: 30rem;
		border-radius: 50%;
	}
`;
const ScUsername = styled.p`
	font-weight: bold;
`;
const ScLeftColumn = styled.div`
	flex: 1;
`;

const ScBold = styled.span`
	font-weight: bold;
	margin-left: 0.5rem;
`;

export default Profile;
