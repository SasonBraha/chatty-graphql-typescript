import { Message } from '../../entities/Message';
import { File } from '../../entities/File';
import { User } from '../../entities/User';
import { createUnionType, Field, ID, ObjectType } from 'type-graphql';
import { SubscriptionTypesEnum } from '../../types/enums';
import { PageInfo } from '../SharedResolvers';

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
export class MessageConnection {
	@Field(type => [MessageEdge]) edges: Array<MessageEdge>;
	@Field(type => PageInfo, { nullable: true }) pageInfo: PageInfo;
}

//------------------------------------//
//  Unions                            //
//------------------------------------//
@ObjectType()
class NewMessageOutput {
	@Field(type => MessageEdge) message: MessageEdge;
	@Field() updateType: string;
}

@ObjectType()
class MessageDeletedOutput {
	@Field(type => ID) messageId: string;
	@Field() updateType: string;
}

@ObjectType()
class FileUploadedOutput {
	@Field(type => ID) messageId: string;
	@Field(type => File) file: File;
	@Field() updateType: string;
}

@ObjectType()
class MessageEditedOutput {
	@Field(type => ID) messageId: string;
	@Field() updatedText: string;
	@Field() updateType: string;
}

export const ChatUpdatesUnion = createUnionType({
	name: 'ChatUpdates',
	types: [
		NewMessageOutput,
		MessageDeletedOutput,
		MessageEditedOutput,
		FileUploadedOutput
	],
	resolveType(value) {
		switch (value.updateType) {
			case SubscriptionTypesEnum.NEW_MESSAGE:
				return NewMessageOutput;

			case SubscriptionTypesEnum.FILE_UPLOADED:
				return FileUploadedOutput;

			case SubscriptionTypesEnum.MESSAGE_DELETED:
				return MessageDeletedOutput;

			case SubscriptionTypesEnum.MESSAGE_EDITED:
				return MessageEditedOutput;
		}
	}
});
