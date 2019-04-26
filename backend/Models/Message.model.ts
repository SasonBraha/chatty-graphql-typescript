import { Document, Schema, model } from 'mongoose';
import File, { IFile, FileEntity } from './File.model';
import { ObjectType, Field, ID } from 'type-graphql';
import { UserEntity, IUser } from './User.model';

export interface IMessage extends Document {
	text: string;
	file: IFile;
	chatSlug: string;
	createdBy: {
		_id: string;
		displayName: string;
		slug: string;
		avatar: string;
	};
}

const MessageSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true
		},
		chatSlug: {
			type: String,
			required: true
		},
		file: {
			type: File
		},
		createdBy: {
			_id: String,
			displayName: String,
			slug: String,
			avatar: String
		}
	},
	{ timestamps: true }
);

@ObjectType()
export class MessageEntity {
	@Field(type => ID)
	_id: string;

	@Field()
	text: string;

	@Field({ nullable: true })
	file: FileEntity;

	@Field(type => UserEntity)
	createdBy: IUser;

	@Field(type => Date)
	createdAt: Date;
}

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
