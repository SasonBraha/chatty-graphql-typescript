import { gql } from 'apollo-server-express';

const typeDefs = gql`
	type User {
		displayName: String!
		email: String!
		slug: String!
		avatar: String!
		role: String!
		lastActivity: String!
	}

	type Chat {
		_id: ID!
		name: String!
		slug: String!
		isPrivate: Boolean!
		storeMessages: Boolean!
		moderators: [User]
		allowedUsers: [User]
		createdBy: User
		lastMessage: String
	}

	type Query {
		# Chat
		chat(slug: String!): Chat
	}

	type Mutation {
		#Auth
		register(displayName: String!, email: String!, password: String!): Boolean
		login(email: String!, password: String!): String

		#Chat
		createChat(
			name: String!
			isPrivate: Boolean!
			storeMessages: Boolean!
		): Chat!
	}
`;

export default typeDefs;
