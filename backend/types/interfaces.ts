import { Request, Response } from 'express';
import { IUser } from '../models/User.model';

export interface IContext {
	req?: Request;
	res?: Response;
	user: IUser | null;
}
