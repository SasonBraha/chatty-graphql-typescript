import { Document, Schema, model } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;
import { IMessage } from './Message.model';
import { IUser } from './User.model';

export interface IChat extends Document {
	name: string;
	slug: string;
	image: {
		link: string;
		isUploaded: boolean;
	};
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
			link: {
				type: String,
				trim: true,
				default: '/images/default_chat.svg'
			},
			isUploaded: {
				type: Boolean,
				default: false
			}
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

const Chat = model<IChat>('Chat', ChatSchema);
export default Chat;
