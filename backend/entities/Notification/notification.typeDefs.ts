import { gql } from 'apollo-server-express';

export default gql`
	type Notification {
		sender: User
		receiver: User
		content: content
		isSeen: Boolean
	}
`;
