import BaseError from './BaseError';

class AuthenticationError extends BaseError {
	constructor(public status: number, public message: string) {
		super();
	}
}

export default AuthenticationError;
