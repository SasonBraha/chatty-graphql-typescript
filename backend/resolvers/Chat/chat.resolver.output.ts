import { IMessage } from '../../models/Message.model';
import { IFile } from '../../models/File.model';
import { Field, ObjectType } from 'type-graphql';

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

export interface IMessageUpdated {
	messageId: string;
	updatedText?: string;
}

@ObjectType()
export class FileAddedOutput {
	@Field()
	chatSlug: string;

	@Field()
	messageId: string;
}
