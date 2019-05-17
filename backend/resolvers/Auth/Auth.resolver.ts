import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import User, { UserEntity } from '../../models/User.model';
import { LoginInput, RegisterInput } from './auth.resolver.inputs';
import { Request } from 'express';
import generateJWT from '../../auth/generateJWT';
import * as uuid from 'uuid';
import {
	throwValidationError,
	validateRegistrationInput
} from '../../utils/validation';
import { ErrorTypesEnum } from '../../utils/errors';
import { googleOAuthClient } from '../../config';

@Resolver(UserEntity)
export default class AuthResolver {
	@Mutation(returns => Boolean)
	async register(
		@Arg('data') { displayName, email, password, captcha }: RegisterInput,
		@Ctx('req') req: Request
	): Promise<boolean> {
		const { isValid, errors } = await validateRegistrationInput({
			displayName,
			email,
			password,
			captcha
		});

		if (!isValid) {
			throwValidationError(errors);
		}

		await User.create({
			displayName,
			email,
			password,
			slug: `${displayName}@${uuid()}`,
			jwtId: uuid(),
			ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		return true;
	}

	@Mutation(returns => String, { nullable: true })
	async login(@Arg('data') { email, password }: LoginInput): Promise<string> {
		const user = await User.findOne({ email });
		if (!user) throw new Error(ErrorTypesEnum.BAD_REQUEST);

		const isPasswordMatch = await user.comparePassword(password);
		if (!isPasswordMatch) throw new Error(ErrorTypesEnum.BAD_REQUEST);

		return generateJWT(user);
	}

	@Mutation(returns => String, { nullable: true })
	async loginWithGoogle(
		@Arg('token') token: string,
		@Ctx('req') req: Request
	): Promise<string> {
		let userData = null;
		// Verify OAuth Token
		const ticket = await googleOAuthClient.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_OAUTH_CLIENT_ID
		});
		const { email, name: displayName, picture: avatar } = ticket.getPayload();

		const user = await User.findOne({ email });
		userData = user
			? user
			: await User.create({
					displayName,
					email,
					avatar,
					slug: `${displayName}@${uuid()}`,
					jwtId: uuid(),
					ipAddress:
						req.headers['x-forwarded-for'] || req.connection.remoteAddress
			  });

		return generateJWT(userData);
	}
}
