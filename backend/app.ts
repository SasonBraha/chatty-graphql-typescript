require('dotenv').config();
import express from 'express';
import helmet from 'helmet';
import socketIO from 'socket.io';
import * as http from 'http';
import * as path from 'path';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as socketioJwt from 'socketio-jwt';

const app = express();
const server = http.createServer(app);
export const io = socketIO(server);

//------------------------------------//
//  Middlewares                       //
//------------------------------------//
app.use(helmet());