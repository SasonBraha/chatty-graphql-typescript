import { Schema } from 'mongoose';

export interface IFile {
	mimeType: string;
	path: string;
	dimensions: {
		width: number;
		height: number;
	};
}

export const File = new Schema({
	mimeType: {
		type: String,
		enum: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
		required: true
	},
	path: {
		type: String,
		required: true
	},
	dimensions: {
		height: {
			type: Number,
			default: 0
		},
		width: {
			type: Number,
			default: 0
		}
	}
});
