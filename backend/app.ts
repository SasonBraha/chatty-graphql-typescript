import 'reflect-metadata';
require('dotenv').config({ path: '../.env' });
import * as http from 'http';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import getUserData from './auth/getUserData';
import { buildSchema } from 'type-graphql';
import { ChatResolver, UserResolver } from './resolvers';
import * as bodyParser from 'body-parser';
import { GraphQLError } from 'graphql';
import AuthenticationError from './utils/errors/AuthenticationError';
import CustomError, { Errors } from './utils/errors';

const main = async () => {
	const app = express();

	//------------------------------------//
	//  DB Config & Connection              //
	//------------------------------------//
	mongoose.set('useCreateIndex', true);
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useFindAndModify: false
		})
		.catch(ex => {
			throw new Error(ex);
		});

	//------------------------------------//
	//  Middlewares                         //
	//------------------------------------//
	// Helmet Security Middleware
	app.use(helmet());

	// Enable { CORS } Sharing And Dev Logging
	if (process.env.NODE_ENV === 'development') {
		app.use(cors());
		app.use(morgan('dev'));
	}

	// Body Parser Middleware
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({ limit: '10mb' }));

	//------------------------------------//
	//  Apollo Setup                        //
	//------------------------------------//
	const schema = await buildSchema({
		resolvers: [UserResolver, ChatResolver]
	});

	const apolloServer = new ApolloServer({
		schema,
		subscriptions: {
			path: '/subscriptions'
		},
		//@ts-ignore
		context: async ({ req, res, connection }) => {
			if (connection) {
				const user = await getUserData(connection.context.authToken);
				return { connection, user };
			} else {
				const user = await getUserData(req.headers.authorization);
				return { req, res, user };
			}
		},
		formatError(ex: GraphQLError) {
			return new CustomError(Errors.InternalServerError);
		}
	});
	apolloServer.applyMiddleware({ app });
	const httpServer = http.createServer(app);
	apolloServer.installSubscriptionHandlers(httpServer);

	//------------------------------------//
	//  Initialize                        //
	//------------------------------------//
	const { PORT } = process.env;
	httpServer.listen(PORT, () =>
		console.log(`Server Started Successfully On Port ${PORT} ✈️`)
	);
};

main();
