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

	type FileDimensions {
		with: Int
		height: Int
	}

	type File {
		mimeType: String
		path: String
		dimensions: FileDimensions
	}

	type MessageCreatedBy {
		_id: ID!
		displayName: String!
		slug: String!
	}

	type Message {
		body: String!
		file: File
		createdBy: MessageCreatedBy
	}

	input MessageInput {
		body: String!
		file: Upload
		chatId: String!
	}

	type ChatImage {
		link: String
		isUploaded: Boolean
	}

	type Chat {
		_id: ID!
		name: String!
		slug: String!
		isPrivate: Boolean!
		storeMessages: Boolean!
		moderators: [User]
		allowedUsers: [User]
		admin: User
		lastMessage: String
		messages: [Message]
		image: ChatImage
	}

	type Query {
		# Chat
		chat(slug: String!): Chat

		roomsList: [Chat]!
	}

	type Mutation {
		#Auth
		registerMutation(
			displayName: String!
			email: String!
			password: String!
		): Boolean
		loginMutation(email: String!, password: String!): String

		#Chat
		createChat(
			name: String!
			isPrivate: Boolean!
			storeMessages: Boolean!
		): Chat!

		postMessage(message: MessageInput): Message!
	}
`;

export default typeDefs;
