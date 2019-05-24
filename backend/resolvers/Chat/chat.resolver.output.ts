import { IMessage } from '../../entities/Message.model';
import { IFile } from '../../entities/File.model';
import { Field, ObjectType } from 'type-graphql';
import { UserEntity } from '../../entities/User.model';

export interface IMessageCreatedOutput {
	message: IMessage;
	updateType: string;
}

export interface IMessageDeletedOutput {
	messageId: string;
	updateType: string;
}

export interface IMessageFileUploadedOutput {
	messageId: string;
	file: IFile;
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
	@Field() user: UserEntity;
}
