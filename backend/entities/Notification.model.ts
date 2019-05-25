import { Document, Schema, model } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;
import { IUser, UserEntity } from './User.model';
import { ObjectType, Field } from 'type-graphql';

export interface INotification extends Document {
	sender: IUser | ObjectID;
	receiver: IUser | ObjectID;
	content: string;
	type: string;
	ref: string;
	isRead: boolean;
}

const NotificationSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		receiver: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		content: String,
		type: {
			type: String,
			required: true
		},
		ref: {
			type: String,
			required: true
		},
		isRead: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

@ObjectType()
export class NotificationEntity {
	@Field(() => UserEntity)
	sender: IUser;

	@Field(() => UserEntity)
	receiver: IUser;

	@Field({ nullable: true })
	content: string;

	@Field()
	type: string;

	@Field()
	ref: string;

	@Field()
	isRead: boolean;
}

// @ts-ignore
NotificationSchema.post('find', async (notifications: Array<INotification>) => {
	for (let notification of notifications) {
		if (!notification.isRead) {
			notification.isRead = true;
			await notification.save();
		}
	}
});

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

export default model<INotification>('Notification', NotificationSchema);
