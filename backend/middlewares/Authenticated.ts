import { MiddlewareFn } from 'type-graphql';
import { ErrorTypesEnum } from '../utils/errors';

export const Authenticated: MiddlewareFn = async ({ context }, next) => {
	// @ts-ignore
	if (!context.user) {
		throw new Error(ErrorTypesEnum.UNAUTHORIZED);
	}

	return next();
};
