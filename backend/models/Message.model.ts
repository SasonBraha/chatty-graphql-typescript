import { Document, Schema, model } from 'mongoose';
import File, { IFile, FileEntity } from './File.model';
import { ObjectType, Field, ID } from 'type-graphql';
import { UserEntity, IUser } from './User.model';
import * as sanitizeHtml from 'sanitize-html';

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

// Sanitize Text
MessageSchema.pre('save', async function(next) {
	const message = this as IMessage;
	if (!message.isModified('text')) return next();
	message.text = sanitizeHtml(message.text, {
		allowedTags: [],
		allowedAttributes: {}
	});
	next();
});

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

	@Field({ defaultValue: false }) isClientDeleted: boolean;
}

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
