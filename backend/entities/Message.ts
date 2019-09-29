import { File } from './File';
import { Field, ID, ObjectType } from 'type-graphql';
import * as sanitizeHtml from 'sanitize-html';
import {
	arrayProp as ArrayProperty,
	pre as Pre,
	prop as Property,
	Typegoose
} from 'typegoose';
import { ObjectId } from 'mongodb';
import { Mention } from './Mention';

@ObjectType()
class CreatedBy {
	@Field() readonly _id: string;
	@Field() displayName: string;
	@Field() slug: string;
	@Field() avatar: string;
}

@ObjectType()
@Pre<Message>('save', async function(next) {
	if (this.isModified('text')) {
		this.text = sanitizeHtml(this.text, {
			allowedTags: [],
			allowedAttributes: {}
		});
	}
	next();
})
export class Message extends Typegoose {
	@Field(type => ID, { nullable: true })
	readonly _id: ObjectId;

	@Field()
	@Property({ required: true })
	text!: string;

	@Field()
	@Property({ required: true })
	chatSlug!: string;

	@Field(type => File, { nullable: true })
	@Property()
	file!: File;

	@Field(type => CreatedBy)
	@Property()
	createdBy: CreatedBy;

	@Field(type => [Mention], { nullable: true })
	@ArrayProperty({ items: Mention })
	userMentions: Array<Mention>;

	@Field({ nullable: true })
	creationToken: string;

	@Field(type => Date, { nullable: true })
	createdAt: Date;
}

export const MessageModel = new Message().getModelForClass(Message, {
	schemaOptions: { timestamps: true }
});
