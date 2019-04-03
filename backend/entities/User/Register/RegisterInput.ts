import { Length, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class RegisterInput {
	@Field()
	@Length(1, 25)
	displayName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	password: string;
}
