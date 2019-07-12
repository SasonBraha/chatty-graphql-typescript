import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { ILocalCache } from '../../../apollo/actions';

const buildQuery = (dataToFetch: string) => {
	return gql`
      query {
          client @client {
              ${dataToFetch}
          }
      }
	`;
};

const useCacheData = (dataToFetch: string): ILocalCache => {
	let { data } = useQuery(buildQuery(dataToFetch));
	console.log(data);
	return data.client;
};

export default useCacheData;
