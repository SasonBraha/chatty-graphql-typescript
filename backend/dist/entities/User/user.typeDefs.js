"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `
	type User {
		displayName: String!
		email: String!
		slug: String!
		avatar: String!
		role: String!
		lastActivity: String!
	}
`;
// export interface IUser extends Document {
// 	displayName: string;
// 	emai: string;
// 	password: string;
// 	slug: string;
// 	avatar: string;
// 	notifications: ObjectId[];
// 	role: 'Admin' | 'Moderator' | 'User';
// 	ipAddress: string;
// 	lastActivity: string;
// 	comparePassword(password: string): boolean;
// }
