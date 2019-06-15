import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const buildQuery = (dataToFetch: string) => gql`
	query {
			client @client {
					${dataToFetch}
			}
	}
`;

const useCacheData = (dataToFetch: string) => {
	const { data } = useQuery(buildQuery(dataToFetch));
	return data.client;
};

export default useCacheData;
