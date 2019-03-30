require('dotenv').config({ path: '../.env' });
import { ApolloServer, gql } from 'apollo-server-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import './Models/User.model';
import getUserData from './auth/getUserData';
import logger from './logger';

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
if (process.env.NODE_ENV !== 'production') {
	app.use(cors());
	app.use(morgan('dev'));
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const bearerToken: string = req.headers.authorization;
		const user = await getUserData(bearerToken);
		return { ...req, user };
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
