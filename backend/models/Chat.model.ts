import { Document, Schema, model } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;
import { IMessage, MessageEntity } from './Message.model';
import { IUser, UserEntity } from './User.model';
import { ObjectType, Field, ID } from 'type-graphql';
import File, { IFile, FileEntity } from './File.model';

export interface IChat extends Document {
	name: string;
	slug: string;
	image: IFile;
	isPrivate: boolean;
	storeMessages: boolean;
	moderators: Array<ObjectID> | Array<IUser>;
	allowedUsers: Array<ObjectID> | Array<IUser>;
	messages: Array<ObjectID> | Array<IMessage>;
	admin: ObjectID | IUser;
	lastMessage: string;
}

const ChatSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		slug: {
			type: String,
			required: true,
			trim: true
		},
		image: {
			type: File
		},
		isPrivate: {
			type: Boolean,
			default: false
		},
		storeMessages: {
			type: Boolean,
			default: true
		},
		moderators: {
			type: [Schema.Types.ObjectId],
			ref: 'User'
		},
		allowedUsers: {
			type: [Schema.Types.ObjectId],
			ref: 'User'
		},
		messages: {
			type: [Schema.Types.ObjectId],
			ref: 'Message'
		},
		admin: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		lastMessage: String
	},
	{ timestamps: true, collection: 'rooms' }
);

@ObjectType()
export class ChatEntity {
	@Field(() => ID)
	_id: string;

	@Field()
	name: string;

	@Field()
	slug: string;

	@Field()
	image: FileEntity;

	@Field()
	isPrivate: boolean;

	@Field()
	storeMessages: boolean;

	@Field(type => [UserEntity])
	moderators: IUser[];

	@Field(type => [UserEntity])
	allowedUsers: IUser[];

	@Field(type => [MessageEntity])
	messages: IMessage;

	@Field(type => UserEntity)
	admin: IUser;

	@Field({ nullable: true })
	lastMessage: string;
}

const Chat = model<IChat>('Chat', ChatSchema);
export default Chat;
