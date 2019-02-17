"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `
	type Chat {
		_id: ID!
		name: String!
		slug: String!
		isPrivate: Boolean!
		storeMessages: Boolean!
		# moderators: [User]
		# allowedUsers: [User]
		# messages: [Message]
		# createdBy: User
		lastMessage: String
		# todo image
	}

	extend type Query {
		chat(slug: String!): Chat
	}

	extend type Mutation {
		createChat(
			name: String!
			isPrivate: Boolean!
			storeMessages: Boolean!
		): Chat!
	}
`;
