import { gql } from 'apollo-server-express';

export default gql`
	type Message {
		body: String!
		file: File
		# Todo
		# createdBy
	}
`;
