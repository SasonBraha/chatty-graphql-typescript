import { Request, Response } from 'express';
import { User } from '../entities/User.model';
import { ObjectId } from 'mongodb';

export interface IContext {
	req?: Request;
	res?: Response;
	user: User | null;
}

export interface IQueryCacheOptions {
	key?: string | ObjectId;
}
