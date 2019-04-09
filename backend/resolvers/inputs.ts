import { InputType, Field, ID, Int } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class CreateChatInput {
	@Field()
	@Length(1, 20)
	name: string;

	@Field()
	isPrivate: boolean;

	@Field()
	storeMessages: boolean;
}

@InputType()
export class RegisterInput {
	@Field()
	@Length(3, 25)
	displayName: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class LoginInput {
	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class UserInput {
	@Field()
	displayName: string;

	@Field()
	email: string;

	@Field()
	avatar: string;

	@Field()
	jwtHandshake: string;

	@Field()
	role: string;

	@Field()
	slug: string;

	@Field()
	_id: string;

	@Field(type => Int)
	iat: number;

	@Field(type => Int)
	exp: number;
}
