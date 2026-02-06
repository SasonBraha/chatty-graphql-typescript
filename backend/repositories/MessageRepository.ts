import { Message, MessageModel } from '../entities/Message';

const create = async (messageData: Message): Promise<Message> => {
	return MessageModel.create(messageData);
};

const findById = async (messageId: string): Promise<Message | null> => {
	return MessageModel.findOne({ _id: messageId });
};

const remove = async (message: Message): Promise<void> => {
	await message.remove();
};

const updateText = async (
	message: Message,
	text: string
): Promise<Message> => {
	message.text = text;
	return message.save();
};

const updateFile = async (
	messageId: string,
	userId: string,
	fileData
): Promise<void> => {
	await MessageModel.updateOne(
		{
			_id: messageId,
			'createdBy._id': userId
		},
		{
			$set: { file: fileData }
		}
	);
};

export default {
	create,
	findById,
	remove,
	updateText,
	updateFile
};
