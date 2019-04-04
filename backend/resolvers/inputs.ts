import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

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
