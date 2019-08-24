import { Field, ID, Int, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class Mention {
	@Field(type => ID) readonly _id: ObjectId;
	@Field(type => [Int]) indices: number[];
	@Field() displayName: string;
	@Field() slug: string;
}
