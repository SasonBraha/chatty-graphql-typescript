import { ObjectID } from 'bson';
import { MessageModel } from '../entities/Message';
import { Chat } from '../entities/Chat';
import { MessageConnection } from '../resolvers/Chat/chat.resolver.output';

const getMessagesForChat = async (
	chat: Chat,
	first?: number,
	last?: number,
	after?: string,
	before?: string
): Promise<MessageConnection> => {
	const limit = first || last || 20;
	const cursor = before || after ? new ObjectID(before || after) : null;
	const messages = await MessageModel.aggregate([
		{
			$match: cursor
				? {
						_id: { [before ? '$gt' : '$lt']: cursor },
						chatSlug: chat.slug
				  }
				: { chatSlug: chat.slug }
		},
		{ $sort: { createdAt: -1 } },
		{ $limit: limit }
	]);

	const edges = messages.map(message => ({
		cursor: message._id,
		node: message
	}));

	return {
		edges: edges.reverse(),
		pageInfo: {
			// @ts-ignore
			async hasNextPage() {
				if (messages.length < limit) return false;
				return Boolean(
					await MessageModel.findOne({
						_id: {
							[before ? '$lt' : '$gt']: messages[messages.length - 1]._id
						},
						chatSlug: chat.slug
					})
				);
			},

			// @ts-ignore
			async hasPreviousPage() {
				if (messages.length < limit) return false;
				return Boolean(
					await MessageModel.findOne({
						_id: { [before ? '$lt' : '$gt']: cursor },
						chatSlug: chat.slug
					})
				);
			}
		}
	};
};

export default {
	getMessagesForChat
};
