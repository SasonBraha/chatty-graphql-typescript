import { InputType, Field } from 'type-graphql';
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
