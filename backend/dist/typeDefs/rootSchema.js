"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const rootSchema = apollo_server_express_1.gql `
	type Query {
		root: String
	}

	type Mutation {
		root: String
	}
`;
exports.default = rootSchema;
