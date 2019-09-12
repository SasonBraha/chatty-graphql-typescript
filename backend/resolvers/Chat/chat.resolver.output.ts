import { Message } from '../../entities/Message';
import { File } from '../../entities/File';
import { User } from '../../entities/User';
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
	@Field(type => User) user: User;
}

@ObjectType()
class MessageEdge {
	@Field() cursor: string;
	@Field(type => Message) node: Message;
}

@ObjectType()
class PageInfo {
	@Field() hasNextPage: boolean;
	@Field() hasPreviousPage: boolean;
}

@ObjectType()
export class MessageConnection {
	@Field(type => [MessageEdge]) edges: Array<MessageEdge>;
	@Field(type => PageInfo) pageInfo: PageInfo;
}
