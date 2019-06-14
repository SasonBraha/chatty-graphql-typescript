import client from './client';
import gql from 'graphql-tag';

export const CLIENT_QUERY = gql`
	{
		client @client {
			isNavOpen
		}
	}
`;

function getData() {
	return client.readQuery({ query: CLIENT_QUERY }).client;
}

function writeData(data: { [key: string]: any }) {
	client.writeData({
		data: {
			client: {
				...data
			}
		}
	});
}

export const setNavState = () => {
	const { isNavOpen } = getData();
	writeData({
		isNavOpen: !isNavOpen
	});
};
