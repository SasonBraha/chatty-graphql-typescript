"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: '../.env' });
const apollo_server_express_1 = require("apollo-server-express");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const typeDefs_1 = require("./typeDefs");
const resolvers_1 = require("./resolvers");
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
const server = new apollo_server_express_1.ApolloServer({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
server.applyMiddleware({ app });
//------------------------------------//
//  Initalize                         //
//------------------------------------//
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server Started Successfully On Port ${PORT}`));
