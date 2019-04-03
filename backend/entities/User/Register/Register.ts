import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';
import UserEntity from '..';
import RegisterInput from './RegisterInput';
import User from '../../../models/User.model';
import uuid from 'uuid';

@Resolver()
export class RegisterResolver {
	@Query(() => String)
	async null() {
		return 'null';
	}

	@Mutation(() => UserEntity)
	async register(
		@Arg('data')
		{ displayName, email, password }: RegisterInput,
		req
	): Promise<UserEntity> {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			displayName,
			email,
			password,
			slug: `${displayName}@${uuid()}`,
			jwtId: uuid(),
			ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
		});
		return newUser;
	}
}
