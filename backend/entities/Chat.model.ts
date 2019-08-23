import { Field, ID, ObjectType } from 'type-graphql';
import File from './File.model';
import {
	arrayProp as ArrayProperty,
	prop as Property,
	Ref,
	Typegoose
} from 'typegoose';
import { ObjectId } from 'mongodb';
import { User } from './User.model';

@ObjectType()
export class Chat extends Typegoose {
	@Field(type => ID)
	readonly _id: ObjectId;

	@Property({ required: true, trim: true })
	@Field(type => String)
	name!: string;

	@Property({ required: true, trim: true })
	@Field(type => String)
	slug!: string;

	@Property({ required: true })
	@Field()
	image!: File;

	@Property({ default: false })
	@Field(type => Boolean)
	isPrivate: boolean;

	@Property({ default: true })
	@Field(type => Boolean)
	storeMessages: boolean;

	@ArrayProperty({ itemsRef: User })
	@Field(type => [User])
	moderators: Ref<User>[];

	@ArrayProperty({ itemsRef: User })
	@Field(type => [User])
	allowedUsers: Ref<User>[];

	@Property({ ref: User, required: true })
	@Field(type => User)
	createdBy: Ref<User>;

	@Property({ required: true, trim: true })
	@Field(type => String)
	lastMessage: string;
}

export const ChatModel = new Chat().getModelForClass(Chat);
