import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateMessageInput {
	@Field(type => ID) messageId: string;
	@Field() crudType: string;
	@Field({ nullable: true }) messageText: string;
}
