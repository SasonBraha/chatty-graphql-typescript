import { Field, ID, Int, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
class FileDimensions {
	@Field(type => Int, { nullable: true })
	height?: number;

	@Field(type => Int, { nullable: true })
	width?: number;
}

@ObjectType()
export class File {
	@Field(type => ID)
	readonly _id?: ObjectId;

	@Field({ nullable: true })
	mimeType: string;

	@Field()
	path: string;

	@Field()
	isStoredRemotely: boolean;

	@Field()
	dimensions: FileDimensions;
}
