import { User } from './User.model';
import { Field, ID, ObjectType } from 'type-graphql';
import { post as Post, prop as Property, Ref, Typegoose } from 'typegoose';
import { ObjectId } from 'mongodb';

@ObjectType()
@Post<Notification>('find', notifications => {
	for (let notification of notifications) {
		if (!notification.isRead) {
			notification.isRead = true;

			// @ts-ignore
			notification.save();
		}
	}
})
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

// NotificationSchema.post('save', async (notification: INotification) => {
//   // Check If Notifications Is New (To Prevent { Schema.post('find') } From Emitting Notification)
//   if (notification.isNew) {
//     // Populate Receiver Credentials
//     const popultedNotification = await notification
//       .populate('receiver', 'slug')
//       .execPopulate();

//     // Emit Notification
//     io.to(popultedNotification.receiver.slug).emit(
//       'server:newNotification',
//       popultedNotification.content
//     );

//     // Save Notificationn Refrence In { Auth<Schema> }
//     await Auth.findOneAndUpdate(
//       { _id: notification.receiver },
//       { $push: { notifications: notification._id } }
//     );
//   }
// });

export const NotificationModel = new Notification().getModelForClass(
	Notification,
	{ schemaOptions: { timestamps: true } }
);
