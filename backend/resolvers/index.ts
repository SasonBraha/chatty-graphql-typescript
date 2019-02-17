import Chat from '../entities/Chat/Chat.model';

const resolvers = {
	Query: {
		chat: async (root, { slug }) => await Chat.findOne({ slug })
	}
};

export default resolvers;
