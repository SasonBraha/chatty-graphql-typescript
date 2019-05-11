import WebSocket = require('ws');
import { ConnectionContext } from 'subscriptions-transport-ws';
import { GraphQLClient } from 'graphql-request';
import { CrudEnum } from '../types/enums';

const handleSocketDisconnect = async (
	_ws: WebSocket,
	context: ConnectionContext
) => {
	// Handle socket disconnect while user is active in chat
	const ctx = await context.initPromise;
	const chatRegex = new RegExp(
		'https?:\\/\\/(?<baseDomain>[\\w\\d:?.?]+)\\/chat\\/(?<chatSlug>[\\w-@\\d]+)'
	);
	const regexResult = chatRegex.exec(ctx.fromUrl);

	if (regexResult && ctx.authToken) {
		const { chatSlug } = regexResult.groups;
		if (chatSlug) {
			const graphqlClient = new GraphQLClient(
				`${process.env.BASE_URL}/graphql`,
				{
					headers: {
						Authorization: ctx.authToken
					}
				}
			);

			const updateActiveUsersMutation = `
				mutation($chatSlug: String!, $crudType: String!) {
					updateActiveUsers(chatSlug: $chatSlug, crudType: $crudType)
				}
			`;

			await graphqlClient.request(updateActiveUsersMutation, {
				chatSlug,
				crudType: CrudEnum.DELETE
			});
		}
	}
};

export default handleSocketDisconnect;
