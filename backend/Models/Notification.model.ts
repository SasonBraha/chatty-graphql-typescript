import { Document, Schema, model } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;
import { IUser } from './User.model';

export interface INotification extends Document {
	sender: IUser | ObjectID;
	receiver: IUser | ObjectID;
	content: string;
	read: boolean;
}

const NotificationSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		receiver: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		content: {
			type: String,
			required: true
		},
		read: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

// @ts-ignore
NotificationSchema.post('find', (notifications: Array<INotification>) => {
	notifications.forEach(notification => {
		if (!notification.read) {
			notification.read = true;
			notification.save();
		}
	});
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

//     // Save Notificationn Refrence In { User<Schema> }
//     await User.findOneAndUpdate(
//       { _id: notification.receiver },
//       { $push: { notifications: notification._id } }
//     );
//   }
// });

export default model<INotification>('Notification', NotificationSchema);
