import { Request } from 'express';
import * as uuid from 'uuid';
import { User, UserController } from '../entities/User';
import { LoginInput, RegisterInput } from '../resolvers/Auth/auth.resolver.inputs';
import { ErrorTypesEnum } from '../utils/errors';
import {
	throwValidationError,
	validateRegistrationInput
} from '../utils/validation';
import { googleOAuthClient, JWT, mailer } from './index';
import UserRepository from '../repositories/UserRepository';

const registerUser = async (
	registerInput: RegisterInput,
	req: Request
): Promise<boolean> => {
	const { captcha, ...rest } = registerInput;
	const { isValid, errors } = await validateRegistrationInput({
		captcha,
		...rest
	});

	if (!isValid) {
		throwValidationError(errors);
	}

	await UserController.createUser(
		{
			...rest
		},
		req
	);
	return true;
};

const login = async ({ email, password }: LoginInput): Promise<string> => {
	const user = await UserRepository.findByEmail(email);
	if (!user) throw new Error(ErrorTypesEnum.BAD_REQUEST);

	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch) throw new Error(ErrorTypesEnum.BAD_REQUEST);

	return JWT.generateToken(user.toJSON(), true, '10d');
};

const loginWithGoogle = async (token: string, req: Request): Promise<string> => {
	const ticket = await googleOAuthClient.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_OAUTH_CLIENT_ID
	});
	const { email, name: displayName, picture: avatar } = ticket.getPayload();
	const user = await UserRepository.findByEmail(email);
	const userData = user
		? user
		: await UserController.createUser({ displayName, email, avatar }, req);

	return JWT.generateToken(userData.toJSON(), true, '10d');
};

const createResetPasswordToken = async (email: string): Promise<string> => {
	const isUserExists = await UserRepository.findByEmail(email);
	if (isUserExists) {
		const restoreToken = `${uuid()}-${uuid()}`;
		await mailer.send(
			email,
			'',
			`<a href="${process.env.BASE_URL}/reset-password/${restoreToken}">לחץ כאן לאתחול הסיסמה</a>`
		);
	}

	return `${!!isUserExists}`;
};

export default {
	registerUser,
	login,
	loginWithGoogle,
	createResetPasswordToken
};
