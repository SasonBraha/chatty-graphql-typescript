import shortid = require('shortid');

require('dotenv').config({ path: './.env' });
import { JWT } from './services';
import 'reflect-metadata';
import { handleSocketDisconnect } from './handlers';
import * as http from 'http';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import { buildSchema } from 'type-graphql';
import { AuthResolver, ChatResolver, UserResolver } from './resolvers';
import * as bodyParser from 'body-parser';
import { GraphQLError } from 'graphql';
import CustomError, { ErrorResponse, ErrorTypesEnum } from './utils/errors';
import { isJson, logger } from './utils';
import * as uuid from 'uuid';
import pubSub from './services/pubSub';
import sanitizer from './services/Sanitizer';
import './permissions';
import './services/cache';
import { User, UserModel } from './entities/User';

const main = async () => {
	const app = express();

	//------------------------------------//
	//  DB Config & Connection            //
	//------------------------------------//
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true
		})
		.then(() => console.log('Connected to MongoDB Successfully'))
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
	app.use(bodyParser.json({ limit: '5mb' }));

	//------------------------------------//
	//  Apollo Setup                      //
	//------------------------------------//
	const schema = await buildSchema({
		resolvers: [AuthResolver, ChatResolver, UserResolver],
		pubSub
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
			let user = await JWT.validateTokenAndGetPayload<User>(
				connection ? connection.context.authToken : req.headers.authorization,
				true
			);
			sanitizer.incomingRequest(
				connection ? connection.variables : req.body.variables
			);

			if (user) {
				user = await UserModel.findOne({ email: user.email }).cache({
					key: user._id
				});
			}

			return {
				connection,
				user,
				req,
				res
			};
		},
		formatError(ex: GraphQLError): any {
			const errorMessage = ex.originalError
				? ex.originalError.message
				: ex.message;
			const errorId = shortid.generate();

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
		console.log(`Server Started Successfully On Port ${PORT} ✈`)
	);

	process
		.on('unhandledRejection', (reason, promise) =>
			logger.error(JSON.stringify(reason), promise)
		)
		.on('uncaughtException', ex => logger.error(ex));
};

main();
