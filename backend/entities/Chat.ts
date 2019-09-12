import { Field, ID, ObjectType } from 'type-graphql';
import {
	arrayProp as ArrayProperty,
	prop as Property,
	Ref,
	Typegoose
} from 'typegoose';
import { ObjectId } from 'mongodb';
import { User } from './User';
import { File } from './File';
import { Message } from './Message';
import { MessageConnection } from '../resolvers/Chat/chat.resolver.output';

@ObjectType()
export class Chat extends Typegoose {
	@Field(type => ID)
	readonly _id: ObjectId;

	@Field(type => String)
	@Property({ required: true, trim: true })
	name!: string;

	@Field(type => String)
	@Property({ required: true, trim: true })
	slug!: string;

	@Field()
	@Property({ required: true })
	image!: File;

	@Field(type => Boolean)
	@Property({ default: false })
	isPrivate: boolean;

	@Field(type => Boolean)
	@Property({ default: true })
	storeMessages: boolean;

	@Field(type => [User])
	@ArrayProperty({ itemsRef: { name: 'User' } })
	moderators: Ref<User>[];

	@Field(type => [User])
	@ArrayProperty({ itemsRef: { name: 'User' } })
	allowedUsers: Ref<User>[];

	@Field(type => User)
	@Property({ ref: { name: 'User' }, required: true })
	createdBy: Ref<User>;

	@Field(type => String, { nullable: true })
	@Property({ trim: true })
	lastMessage: string;

	@Field(type => MessageConnection)
	messages: MessageConnection;
}

export const ChatModel = new Chat().getModelForClass(Chat, {
	schemaOptions: { timestamps: true, collection: 'chatRooms' }
});
