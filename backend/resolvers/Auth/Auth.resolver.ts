import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../entities/User';
import { LoginInput, RegisterInput } from './auth.resolver.inputs';
import { Request } from 'express';
import AuthService from '../../services/AuthService';

@Resolver(User)
export default class AuthResolver {
	@Mutation(returns => Boolean)
	async register(
		@Arg('data') registerInput: RegisterInput,
		@Ctx('req') req: Request
	): Promise<boolean> {
		return AuthService.registerUser(registerInput, req);
	}

	@Mutation(returns => String, { nullable: true })
	async login(@Arg('data') { email, password }: LoginInput): Promise<string> {
		return AuthService.login({ email, password });
	}

	@Mutation(returns => String, { nullable: true })
	async loginWithGoogle(
		@Arg('token') token: string,
		@Ctx('req') req: Request
	): Promise<string> {
		return AuthService.loginWithGoogle(token, req);
	}

	@Mutation(returns => String)
	async createRestPasswordToken(@Arg('email') email: string) {
		return AuthService.createResetPasswordToken(email);
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
