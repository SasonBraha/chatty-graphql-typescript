import { Schema } from 'mongoose';
import { ObjectType, Field, ID, InputType, Int } from 'type-graphql';

export interface IFile {
	mimeType?: string;
	path: string;
	isStored: boolean;
	dimensions: {
		width?: number;
		height?: number;
	};
}

const File = new Schema({
	mimeType: {
		type: String,
		enum: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'mp4']
	},
	path: {
		type: String,
		required: true
	},
	isStored: Boolean,
	dimensions: {
		height: {
			type: Number
		},
		width: {
			type: Number
		}
	}
});

@ObjectType()
class FileDimensions {
	@Field(type => Int, { nullable: true })
	height: number;

	@Field(type => Int, { nullable: true })
	width: number;
}

@ObjectType()
export class FileEntity {
	@Field({ nullable: true })
	mimeType: string;

	@Field()
	path: string;

	@Field()
	isStored: boolean;

	@Field()
	dimensions: FileDimensions;
}

export default File;
