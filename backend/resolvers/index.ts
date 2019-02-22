import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import Chat, { IChat } from '../Models/Chat.model';
import User from '../Models/User.model';
import { Schema } from 'mongoose';
import ObjectID = Schema.Types.ObjectId;

const resolvers = {
	Query: {
		// Chat
		chat: async (root, { slug }) => await Chat.findOne({ slug })
	},

	Mutation: {
		//------------------------------------//
		//  Auth                              //
		//------------------------------------//
		//? Register Process
		register: async (_, { displayName, email, password }, { req }) => {
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

		//? Login Process
		login: async (_, { email, password }) => {
			try {
				// Check If User Exist
				const user = await User.findOne({ email });
				if (!user) return null;

				// Validate Password
				const isPasswordMatch = await user.comparePassword(password);
				if (!isPasswordMatch) return null;

				// Generate { Json Web Token }
				const userData = {
					displayName: user.displayName,
					email: user.email,
					avatar: user.avatar,
					jwtId: user.jwtId
				};
				const authToken = await jwt.sign(userData, process.env.JWT_SECRET, {
					expiresIn: '7d'
				});

				return authToken;
			} catch (ex) {
				return null;
			}
		},

		//------------------------------------//
		//  Chat                              //
		//------------------------------------//
		//? Create Chat Process
		createChat: async (root, args) => {
			const newChatRoom = await Chat.create(args);
			return newChatRoom;
		}
	},

	User: {},

	Chat: {
		createdBy: async (root: IChat, args) => {
			const { createdBy: userId }: { createdBy: ObjectID } = root;
			return await User.findById(userId);
		}
	}
};

export default resolvers;
