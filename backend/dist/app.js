"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: '../.env' });
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
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
// const server = new ApolloServer({ typeDefs, resolvers });
// server.applyMiddleware({ app });
//------------------------------------//
//  Initalize                         //
//------------------------------------//
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server Started Successfully On Port ${PORT}`));
