import { Message } from '../../entities/Message.model';
import { File } from '../../entities/File.model';
import { User } from '../../entities/User.model';
import { Field, ObjectType } from 'type-graphql';

export interface IMessageCreatedOutput {
	message: Message;
	updateType: string;
}

export interface IMessageDeletedOutput {
	messageId: string;
	updateType: string;
}

export interface IMessageFileUploadedOutput {
	messageId: string;
	file: File;
	updateType: string;
}

@ObjectType()
export class FileAddedOutput {
	@Field()
	chatSlug: string;

	@Field()
	messageId: string;
}

@ObjectType()
export class UserTypingOutput {
	@Field() chatSlug: string;
	@Field() crudType: string;
	@Field() user: User;
}
