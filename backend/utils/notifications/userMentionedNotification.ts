import { NotificationTypesEnum } from './index';

const userMentionedNotification = (
	senderId: string,
	receiverId: string,
	ref: string
) => ({
	sender: senderId,
	receiver: receiverId,
	content: null,
	type: NotificationTypesEnum.USER_MENTION,
	ref
});

export default userMentionedNotification;
