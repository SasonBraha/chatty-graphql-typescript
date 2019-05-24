require('dotenv').config({ path: './.env' });
import 'reflect-metadata';
import { handleSocketDisconnect } from './handlers';
import * as http from 'http';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import getUserData from './auth/getUserData';
import { buildSchema } from 'type-graphql';
import { ChatResolver, AuthResolver, UserResolver } from './resolvers';
import * as bodyParser from 'body-parser';
import { GraphQLError } from 'graphql';
import CustomError, { ErrorResponse, ErrorTypesEnum } from './utils/errors';
import { isJson, logger } from './utils';
import * as uuid from 'uuid';
import './permissions';

const main = async () => {
	const app = express();

	//------------------------------------//
	//  DB Config & Connection            //
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
	//  Middlewares                       //
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
	//  Apollo Setup                      //
	//------------------------------------//
	const schema = await buildSchema({
		resolvers: [AuthResolver, ChatResolver, UserResolver],
		validate: false
	});

	const apolloServer = new ApolloServer({
		schema,
		subscriptions: {
			path: '/subscriptions',
			onDisconnect: async (_ws, context) => {
				handleSocketDisconnect(_ws, context);
			}
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
		formatError(ex: GraphQLError): any {
			const errorMessage = ex.originalError.message;
			const errorId = uuid();

			if (isJson(errorMessage)) {
				const parsedError = JSON.parse(errorMessage);
				if (parsedError.type === ErrorTypesEnum.BAD_REQUEST) {
					return new CustomError(
						ErrorResponse.BadRequest,
						errorId,
						parsedError.errors.reduce((acc, currentError) => {
							Object.assign(acc, currentError);
							return acc;
						}, {})
					);
				}
			}

			if (
				errorMessage === ErrorTypesEnum.INTERNAL_SERVER_ERROR ||
				!ErrorResponse[errorMessage]
			) {
				ex.extensions.id = errorId;
				logger.error(ex);
			}

			return new CustomError(
				ErrorResponse[errorMessage]
					? ErrorResponse[errorMessage]
					: ErrorResponse.InternalServerError,
				errorId
			);
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

	process
		.on('unhandledRejection', (reason, promise) =>
			logger.error(reason, promise)
		)
		.on('uncaughtException', ex => logger.error(ex));
};

main();
