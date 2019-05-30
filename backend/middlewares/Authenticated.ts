import { MiddlewareFn } from 'type-graphql';
import { ErrorTypesEnum } from '../utils/errors';
import { IContext } from '../types/interfaces';

export const Authenticated: MiddlewareFn = async ({ context }, next) => {
	if (!(context as IContext).user) {
		throw new Error(ErrorTypesEnum.UNAUTHORIZED);
	}

	return next();
};
