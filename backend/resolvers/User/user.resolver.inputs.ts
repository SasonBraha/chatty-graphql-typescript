import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
	@Field() displayName: string;

	@Field() email: string;

	@Field() password: string;

	@Field() captcha: string;
}

@InputType()
export class LoginInput {
	@Field() email: string;

	@Field() password: string;
}
