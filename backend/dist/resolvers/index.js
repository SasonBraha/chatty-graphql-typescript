"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_model_1 = require("../entities/Chat/Chat.model");
const resolvers = {
    Query: {
        chat: async (root, { slug }) => await Chat_model_1.default.findOne({ slug })
    }
};
exports.default = resolvers;
