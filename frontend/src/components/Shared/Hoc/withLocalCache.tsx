import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const buildQuery = (dataToFetch: string) => gql`
    query {
        client @client {
            ${dataToFetch}
        }
    }
`;

const withLocalCache = (dataToFetch: string) => (
	WrappedComponent: any
): typeof WrappedComponent => {
	return props => {
		const { data } = useQuery(buildQuery(dataToFetch));
		return <WrappedComponent {...props} {...data.client} />;
	};
};
export default withLocalCache;
