import { IMessage } from '../../models/Message.model';
import { IFile } from '../../models/File.model';

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
