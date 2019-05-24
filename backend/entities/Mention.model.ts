import { Document, Schema } from 'mongoose';
import { ObjectType, Field, ID, Int } from 'type-graphql';

export interface IMention {
	indices: number[];
	displayName: string;
	slug: string;
	_id: string;
}

const MentionSchema = new Schema({
	indices: {
		type: [Number]
	},
	displayName: String,
	slug: String,
	_id: String
});

@ObjectType()
export class MentionEntity {
	@Field(type => [Int]) indices: number[];
	@Field() displayName: string;
	@Field() slug: string;
	@Field() _id: string;
}

export default MentionSchema;
