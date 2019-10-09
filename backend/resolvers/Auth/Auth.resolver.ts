import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserModel } from '../../entities/User';
import { LoginInput, RegisterInput } from './auth.resolver.inputs';
import { Request } from 'express';
import generateJWT from '../../auth/generateJWT';
import * as uuid from 'uuid';
import {
	throwValidationError,
	validateRegistrationInput
} from '../../utils/validation';
import { ErrorTypesEnum } from '../../utils/errors';
import { googleOAuthClient, JWT, mailer } from '../../services';

@Resolver(User)
export default class AuthResolver {
	@Mutation(returns => Boolean)
	async register(
		@Arg('data') registerInput: RegisterInput,
		@Ctx('req') req: Request
	): Promise<boolean> {
		const { captcha, ...rest } = registerInput;
		const { isValid, errors } = await validateRegistrationInput({
			captcha,
			...rest
		});

		if (!isValid) {
			throwValidationError(errors);
		}

		await UserModel.create({
			...rest,
			slug: `${rest.displayName}@${uuid()}`,
			jwtHandshake: uuid(),
			ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		return true;
	}

	@Mutation(returns => String, { nullable: true })
	async login(@Arg('data') { email, password }: LoginInput): Promise<string> {
		const user = await UserModel.findOne({ email });
		if (!user) throw new Error(ErrorTypesEnum.BAD_REQUEST);

		const isPasswordMatch = await user.comparePassword(password);
		if (!isPasswordMatch) throw new Error(ErrorTypesEnum.BAD_REQUEST);

		return await JWT.generateToken(user.toJSON(), true, '10d');
	}

	@Mutation(returns => String, { nullable: true })
	async loginWithGoogle(
		@Arg('token') token: string,
		@Ctx('req') req: Request
	): Promise<string> {
		const ticket = await googleOAuthClient.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_OAUTH_CLIENT_ID
		});
		const { email, name: displayName, picture: avatar } = ticket.getPayload();
		const user = await UserModel.findOne({ email });
		const userData = user
			? user
			: await UserModel.create({
					displayName,
					email,
					avatar,
					slug: `${displayName}@${uuid()}`,
					jwtHandshake: uuid(),
					ipAddress:
						req.headers['x-forwarded-for'] || req.connection.remoteAddress
			  });

		return await JWT.generateToken(userData.toJSON(), true, '10d');
	}

	@Mutation(returns => String)
	async createRestPasswordToken(@Arg('email') email: string) {
		const isUserExists = await UserModel.findOne({ email });
		if (isUserExists) {
			const restoreToken = `${uuid()}-${uuid()}`;
			await mailer.send(
				email,
				'',
				`<a href="${process.env.BASE_URL}/reset-password/${restoreToken}">לחץ כאן לאתחול הסיסמה</a>`
			);
		}

		return `${!!isUserExists}`;
	}

	@Query(returns => Boolean)
	async validateResetPasswordToken(@Arg('token') token: string) {}

	@Mutation(returns => Boolean)
	async changePassword(
		@Ctx('user') user: User,
		@Arg('token', { nullable: true }) token: string,
		@Arg('newPassword') newPassword: string
	) {}
}
