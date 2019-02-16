"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express = require("express");
const helmet = require("helmet");
const app = express();
//------------------------------------//
//  Middlewares                       //
//------------------------------------//
app.use(helmet());
// Construct a schema, using GraphQL schema language
const typeDefs = apollo_server_express_1.gql `
  type Query {
    hello: String
  }
`;
// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });
//------------------------------------//
//  Initalize                         //
//------------------------------------//
const PORT = process.env.PORT;
app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
