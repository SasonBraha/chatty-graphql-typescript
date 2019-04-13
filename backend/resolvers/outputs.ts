import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class FileAddedOutput {
	@Field()
	chatSlug: string;

	@Field()
	messageId: string;
}
