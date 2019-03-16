"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        link: {
            type: String,
            trim: true,
            default: '/images/default_chat.svg'
        },
        isUploaded: {
            type: Boolean,
            default: false
        }
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    storeMessages: {
        type: Boolean,
        default: true
    },
    moderators: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User'
    },
    allowedUsers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User'
    },
    messages: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Message'
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastMessage: String
}, { timestamps: true, collection: 'rooms' });
const Chat = mongoose_1.model('Chat', ChatSchema);
exports.default = Chat;
