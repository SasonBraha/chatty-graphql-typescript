import { ErrorTypesEnum } from '../errors';

class IErrors {
	[key: string]: string;
}

const throwValidationError = (errors: IErrors[]): void => {
	throw new Error(
		JSON.stringify({
			type: ErrorTypesEnum.BAD_REQUEST,
			errors
		})
	);
};

export default throwValidationError;
