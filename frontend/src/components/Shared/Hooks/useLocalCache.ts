import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ILocalCache } from '../../../apollo/actions';

const buildQuery = (dataToFetch: string) => gql`
	query {
			client @client {
					${dataToFetch}
			}
	}
`;

const useCacheData = (dataToFetch: string): ILocalCache => {
	let { data } = useQuery(buildQuery(dataToFetch));
	data = data.client;

	if (data.chat && data.chat.typingUsers) {
		return {
			...data,
			chat: {
				...data.chat,
				typingUsers: data.chat.typingUsers.length
					? JSON.parse(data.chat.typingUsers)
					: {}
			}
		};
	}

	return data;
};

export default useCacheData;
