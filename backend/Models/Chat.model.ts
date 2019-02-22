import { Document, Schema, model } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;
import Message, { IMessage } from './Message.model';

export interface IChat extends Document {
	name: string;
	slug: string;
	image: {
		link: string;
		isUploaded: boolean;
	};
	isPrivate: boolean;
	storeMessages: boolean;
	moderators: ObjectID[];
	allowedUsers: ObjectID[];
	messages: Array<IMessage>;
	createdBy: ObjectID;
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
			trim: true,
			validate: {
				validator: async slug => await Chat.doesntExist({ slug }),
				message: () => 'שם החדר שבחרת תפוס, אנא בחר/י שם אחר'
			}
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
		// messages: {
		// 	type: [Message],
		// 	select: false
		// },
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		lastMessage: String
	},
	{ timestamps: true, collection: 'chatRooms' }
);

ChatSchema.statics.doesntExist = async function(opts) {
	return (await this.where(opts).countDocuments()) === 0;
};

const Chat = model<IChat>('Chat', ChatSchema);
export default Chat;
