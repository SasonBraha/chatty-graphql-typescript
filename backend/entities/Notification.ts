import { User } from './User';
import { Field, ID, ObjectType } from 'type-graphql';
import { post as Post, prop as Property, Ref, Typegoose } from 'typegoose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

@ObjectType()
@Post<Notification>(
	'find',
	async (notifications: Array<Notification & Document>) => {
		for (let notification of notifications) {
			if (!notification.isRead) {
				notification.isRead = true;
				await notification.save();
			}
		}
	}
)
export class Notification extends Typegoose {
	@Field(type => ID)
	readonly _id: ObjectId;

	@Field(type => User)
	@Property({ ref: { name: 'User' }, required: true })
	sender: Ref<User>;

	@Field(type => User)
	@Property({ ref: { name: 'User' }, required: true })
	receiver: Ref<User>;

	@Field()
	@Property()
	content: string;

	@Field()
	@Property({ required: true })
	type!: string;

	@Field()
	@Property({ required: true })
	ref: string;

	@Field()
	@Property({ default: false })
	isRead: boolean;
}

export const NotificationModel = new Notification().getModelForClass(
	Notification,
	{ schemaOptions: { timestamps: true } }
);
