"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const Chat_model_1 = require("../models/Chat.model");
const User_model_1 = require("../Models/User.model");
const resolvers = {
    Query: {
        // Chat
        chat: async (root, { slug }) => await Chat_model_1.default.findOne({ slug })
    },
    Mutation: {
        //------------------------------------//
        //  Auth                              //
        //------------------------------------//
        //? Register Process
        register: async (_, { displayName, email, password }, { req }) => {
            try {
                await User_model_1.default.create({
                    displayName,
                    email,
                    password,
                    slug: `${displayName}@${uuid()}`,
                    jwtId: uuid(),
                    ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                });
                return true;
            }
            catch (ex) {
                return false;
            }
        },
        //? Login Process
        login: async (_, { email, password }) => {
            try {
                // Check If User Exist
                const user = await User_model_1.default.findOne({ email });
                if (!user)
                    return null;
                // Validate Password
                const isPasswordMatch = await user.comparePassword(password);
                if (!isPasswordMatch)
                    return null;
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
            }
            catch (ex) {
                return null;
            }
        },
        //------------------------------------//
        //  Chat                              //
        //------------------------------------//
        //? Create Chat Process
        createChat: async (root, args) => {
            const newChatRoom = await Chat_model_1.default.create(args);
            return newChatRoom;
        }
    },
    User: {},
    Chat: {
        createdBy: async (root, args) => {
            const { createdBy: userId } = root;
            return await User_model_1.default.findById(userId);
        }
    }
};
exports.default = resolvers;
