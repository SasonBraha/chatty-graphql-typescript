import { Request, Response } from 'express';
import { IUser } from '../entities/User.model';

export interface IContext {
	req?: Request;
	res?: Response;
	user: IUser | null;
}
