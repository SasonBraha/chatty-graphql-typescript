import { CLIENT_QUERY } from '../../../apollo/actions';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo-hooks';

const useCacheData = (deps: string[]) => {
	const {
		// @ts-ignore
		data: { client }
	} = useQuery(CLIENT_QUERY);

	return client;
};

export default useCacheData;
