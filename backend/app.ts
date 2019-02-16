import { ApolloServer, gql } from 'apollo-server-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as path from 'path';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as socketioJwt from 'socketio-jwt';
import * as graphqlHTTP from 'express-graphql';

const app = express();

//------------------------------------//
//  Middlewares                       //
//------------------------------------//
app.use(helmet());

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
	type Query {
		hello: String
	}
`;

// Provide resolver functions for your schema fields
const resolvers = {
	Query: {
		hello: () => 'Hello world!'
	}
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

//------------------------------------//
//  Initalize                         //
//------------------------------------//
const PORT = process.env.PORT;
app.listen({ port: 4000 }, () =>
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
