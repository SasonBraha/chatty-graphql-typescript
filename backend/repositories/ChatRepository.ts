import { Chat, ChatModel } from '../entities/Chat';

const findBySlugForUser = async (
	chatSlug: string,
	userId: string
): Promise<Chat | null> => {
	return ChatModel.findOne({
		$or: [
			{ slug: chatSlug, isPrivate: false },
			{
				slug: chatSlug,
				isPrivate: true,
				allowedUsers: userId
			}
		]
	}).lean();
};

const listForUser = async (userId: string): Promise<Chat[]> => {
	return ChatModel.find({
		$or: [
			{ isPrivate: false },
			{
				isPrivate: true,
				allowedUsers: userId
			}
		]
	}).sort({ updatedAt: -1 });
};

const findStorableRoomForUser = async (
	chatSlug: string,
	userId: string
): Promise<Chat | null> => {
	return ChatModel.findOne({
		$or: [
			{ slug: chatSlug, isPrivate: false, storeMessages: true },
			{
				slug: chatSlug,
				isPrivate: true,
				storeMessages: true,
				allowedUsers: userId
			}
		]
	});
};

const updateLastMessage = async (
	chatId: string,
	lastMessage: string
): Promise<void> => {
	await ChatModel.updateOne({ _id: chatId }, { $set: { lastMessage } });
};

export default {
	findBySlugForUser,
	listForUser,
	findStorableRoomForUser,
	updateLastMessage
};
