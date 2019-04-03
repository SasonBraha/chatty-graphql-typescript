import 'reflect-metadata';
require('dotenv').config({ path: '../.env' });
import { ApolloServer, gql, PubSub } from 'apollo-server-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import './Models/User.model';
import getUserData from './auth/getUserData';
//@ts-ignore
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import { RegisterResolver } from './entities/User/Register/Register';

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

	const schema = await buildSchema({
		resolvers: [RegisterResolver]
	});
	const pubsub = new PubSub();
	const server = new ApolloServer({
		schema,
		formatError: formatArgumentValidationError,
		context: async ({ req, res }) => {
			const bearerToken: string = req.headers.authorization;
			const user = await getUserData(bearerToken);
			return { req, res, pubsub, user };
		}
	});
	server.applyMiddleware({ app });
	//------------------------------------//
	//  Initalize                         //
	//------------------------------------//
	const { PORT } = process.env;
	app.listen(PORT, () =>
		console.log(`Server Started Successfully On Port ${PORT} ✈️`)
	);
};

main();
