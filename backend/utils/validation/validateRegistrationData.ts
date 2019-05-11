import * as Joi from 'joi';
import { RegisterInput } from '../../resolvers/User/user.resolver.inputs';
import * as rp from 'request-promise';
import { googleOAuthClient } from '../../config';

interface IErrors {
	[key: string]: string;
}

interface IValidationOutput {
	isValid: boolean;
	errors: IErrors[] | null;
}

const validateRegistrationInput = async (
	registrationData: RegisterInput
): Promise<IValidationOutput> => {
	const captchaVildation = await rp({
		method: 'POST',
		uri: 'https://www.google.com/recaptcha/api/siteverify',
		qs: {
			secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
			response: registrationData.captcha
		},
		json: true
	});

	if (!captchaVildation.success) {
		return {
			isValid: false,
			errors: [{ captcha: 'אימות האישיות נכשל' }]
		};
	}

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
			.error(() => 'הסיסמה חייבת להכיל לכל הפחות 6 תווים'),
		captcha: Joi.string()
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
