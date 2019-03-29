import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import Chat, { IChat } from '../models/Chat.model';
import User from '../Models/User.model';
import { Schema } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;
import generateJWT from '../auth/generateJWT';

const resolvers = {
	Query: {
		// Chat
		chat: async (root, { slug }) => await Chat.findOne({ slug })
	},

	Mutation: {
		//------------------------------------//
		//  Auth                              //
		//------------------------------------//
		// Register Process
		registerMutation: async (_, { displayName, email, password }, req) => {
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
		loginMutation: async (_, { email, password }, req) => {
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
		createChat: async (root, args) => {
			const newChatRoom = await Chat.create(args);
			return newChatRoom;
		}
	},

	User: {},

	Chat: {
		admin: async (root: IChat, args) => {
			const { admin: userId } = root;
			return await User.findById(userId);
		},
		messages: async (root: IChat, args) => {}
	}
};

export default resolvers;
