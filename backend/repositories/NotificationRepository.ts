import { Notification, NotificationModel } from '../entities/Notification';

const listForReceiver = async (receiverId: string): Promise<Notification[]> => {
	return NotificationModel.find({ receiver: receiverId })
		.populate('sender', 'displayName slug')
		.sort({ createdAt: -1 })
		.limit(10);
};

const create = async (notificationData): Promise<Notification> => {
	return NotificationModel.create(notificationData);
};

const countUnreadForReceiver = async (receiverId: string): Promise<number> => {
	return NotificationModel.countDocuments({
		receiver: receiverId,
		isRead: false
	});
};

export default {
	listForReceiver,
	create,
	countUnreadForReceiver
};
