import React from 'react';
import styled, { css } from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import formatRelative from 'date-fns/formatRelative';
import { parseISO } from 'date-fns';
import he from 'date-fns/locale/he';
import { useTranslation } from 'react-i18next';
import { Image } from '../Shared';
import { useGetUserQuery } from '../../__generated__/graphql';

interface IRouteParams {
	slug: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {}

const Profile: React.FC<IProps> = props => {
	const userSlug = props.match.params.slug;
	const { data, loading } = useGetUserQuery({
		variables: { slug: userSlug }
	});
	const { t } = useTranslation();

	// @ts-ignore
	return loading ? (
		<div>Loading...</div>
	) : (
		<S.Profile>
			<S.RightColumn>
				<S.Container column>
					<S.ProfileImage>
						<Image
							src={data.user.avatar}
							alt={t('profile.imageAlt', {
								displayName: data.user.displayName
							})}
						/>
					</S.ProfileImage>
					<S.Username>{data.user.displayName}</S.Username>
				</S.Container>
				<S.Container row>
					<S.Bold>{t('profile.registrationDate')}</S.Bold>
					{formatRelative(
						parseISO((data.user.createdAt as unknown) as string),
						new Date(),
						{
							locale: he
						}
					)}
				</S.Container>
			</S.RightColumn>
			<S.LeftColumn></S.LeftColumn>
		</S.Profile>
	);
};

const S: any = {};
S.Profile = styled.div`
	width: 100%;
	height: 100%;
	padding: 15px;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
`;

S.RightColumn = styled.div`
	flex: 1;
`;

S.Container = styled('div')<{ column?: boolean; row?: boolean }>`
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
S.ProfileImage = styled.figure`
	img {
		width: 30rem;
		height: 30rem;
		border-radius: 50%;
	}
`;
S.Username = styled.p`
	font-weight: bold;
`;
S.LeftColumn = styled.div`
	flex: 1;
`;

S.Bold = styled.span`
	font-weight: bold;
	margin-left: 0.5rem;
`;

export default Profile;
