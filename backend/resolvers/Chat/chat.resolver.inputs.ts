import { Field, ID, InputType } from 'type-graphql';
import { Stream } from 'stream';

@InputType()
export class CreateChatInput {
	@Field() name: string;
	@Field() isPrivate: boolean;
	@Field() storeMessages: boolean;
}

@InputType()
export class UpdateMessageInput {
	@Field(type => ID) messageId: string;
	@Field() crudType: string;
	@Field({ nullable: true }) messageText: string;
	@Field({ nullable: true }) creationToken: string;
	@Field() chatSlug: string;
}

export interface IFileInput {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Stream;
}
