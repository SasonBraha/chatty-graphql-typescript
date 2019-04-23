import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import User, { UserEntity } from '../models/User.model';
import { LoginInput, RegisterInput } from './inputs';
import { Request } from 'express';
import generateJWT from '../auth/generateJWT';
import * as uuid from 'uuid';
import {
	throwValidationError,
	validateRegistrationInput
} from '../utils/validation';

@Resolver(UserEntity)
export default class UserResolver {
	@Mutation(returns => Boolean)
	async register(
		@Arg('data') { displayName, email, password }: RegisterInput,
		@Ctx('req') req: Request
	): Promise<boolean> {
		const { isValid, errors } = validateRegistrationInput({
			displayName,
			email,
			password
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
		try {
			const user = await User.findOne({ email });
			if (!user) return null;

			const isPasswordMatch = await user.comparePassword(password);
			if (!isPasswordMatch) return null;

			return generateJWT(user);
		} catch (ex) {
			return null;
		}
	}
}
