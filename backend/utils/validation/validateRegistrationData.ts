import * as Joi from 'joi';
import { RegisterInput } from '../../resolvers/inputs';

interface IErrors {
	[key: string]: string;
}

interface IValidationOutput {
	isValid: boolean;
	errors: IErrors[] | null;
}

const validateRegistrationInput = (
	registrationData: RegisterInput
): IValidationOutput => {
	const joiSchema = Joi.object().keys({
		displayName: Joi.string()
			.min(3)
			.max(25)
			.error(
				() => 'שם המשתמש חייב להכיל לכל הפחות 3 תווים ולכל היותר 25 תווים'
			),
		email: Joi.string()
			.email({ minDomainAtoms: 2 })
			.error(() => 'כתובת דואר האלקטרוני שהוזנה אינה תקנית'),
		password: Joi.string()
			.min(6)
			.error(() => 'הסיסמה חייבת להכיל לכל הפחות 6 תווים')
	});

	const validationResult = Joi.validate(registrationData, joiSchema, {
		abortEarly: false
	});

	if (validationResult.error) {
		const joiErrors = validationResult.error.details;
		const errorsArr: IErrors[] = joiErrors.reduce((acc, currentError) => {
			acc.push({
				[currentError.path[0]]: currentError.message
			});
			return acc;
		}, []);

		return {
			isValid: false,
			errors: errorsArr
		};
	}

	return {
		isValid: true,
		errors: null
	};
};

export default validateRegistrationInput;
