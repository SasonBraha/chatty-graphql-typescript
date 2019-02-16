import { Document, Schema, model } from 'mongoose';
import { File, IFile } from '../File/File.model';

export interface IMessage extends Document {
	body: string;
	file: IFile;
	createdBy: {
		_id: string;
		displayName: string;
		slug: string;
	};
}

const MessageSchema = new Schema(
	{
		body: {
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

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
