import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import Chat, { IChat } from '../models/Chat.model';
import User from '../models/User.model';
import generateJWT from '../auth/generateJWT';
import Message from '../models/Message.model';

const resolvers = {
	Query: {
		// Chat
		chat: async (root, { slug }) => await Chat.findOne({ slug }),
		async roomsList(root, args, req) {
			return await Chat.find();
		}
	},

	Mutation: {
		//------------------------------------//
		//  Auth                              //
		//------------------------------------//
		// Register Process
		async registerMutation(_, { displayName, email, password }, req) {
			try {
				await User.create({
					displayName,
					email,
					password,
					slug: `${displayName}@${uuid()}`,
					jwtId: uuid(),
					ipAddress:
						req.headers['x-forwarded-for'] || req.connection.remoteAddress
				});
				return true;
			} catch (ex) {
				return false;
			}
		},

		// Login Process
		async loginMutation(_, { email, password }, req) {
			try {
				// Check If User Exist
				const user = await User.findOne({ email });
				if (!user) return null;

				// Validate Password
				const isPasswordMatch = await user.comparePassword(password);
				if (!isPasswordMatch) return null;

				return generateJWT(user);
			} catch (ex) {
				return null;
			}
		},

		//------------------------------------//
		//  Chat                              //
		//------------------------------------//
		// Create Chat Process
		async createChat(root, args, req) {
			const newChatRoom = await Chat.create({
				...args,
				admin: req.user._id,
				slug: `${args.name}@${uuid()}`
			});
			return newChatRoom;
		},

		async postMessage(root, args, req) {
			// Create New Message
			const newMessage = await Message.create({
				...args.message,
				createdBy: {
					_id: req.user._id,
					displayName: req.user.displayName,
					slug: req.user.slug
				}
			});

			// Save Message Id To Chat
			await Chat.update(
				{ _id: args.message.chatId },
				{
					$push: { messages: newMessage._id },
					$set: { lastMessage: newMessage.text }
				}
			);

			return newMessage;
		}
	},

	User: {},

	Chat: {
		async admin(root: IChat, args) {
			const { admin: userId } = root;
			return await User.findById(userId);
		},

		async messages(root: IChat, args) {
			const populatedChat = await Chat.findById(root._id)
				.populate({
					path: 'messages',
					model: 'Message'
				})
				.lean();

			return populatedChat.messages;
		}
	}
};

export default resolvers;
