import { Document, Schema, model } from 'mongoose';
import { File, IFile } from './File.model';
import { ObjectType, Field } from 'type-graphql';
import { UserEntity, IUser } from './User.model';

export interface IMessage extends Document {
	text: string;
	file: IFile;
	createdBy: {
		_id: string;
		displayName: string;
		slug: string;
	};
}

const MessageSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true
		},
		file: {
			type: File
		},
		createdBy: {
			_id: String,
			displayName: String,
			slug: String
		}
	},
	{ timestamps: true }
);

@ObjectType()
export class MessageEntity {
	@Field()
	_id: string;

	@Field()
	text: string;

	@Field(type => UserEntity)
	createdBy: IUser;
}

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
