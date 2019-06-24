import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const USER_QUERY = gql`
	query userQuery($slug: String!) {
		user(slug: $slug) {
			displayName
			avatar
			email
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
		<ScProfile>{data.user.displayName}</ScProfile>
	);
};

const ScProfile = styled.div``;

export default Profile;
