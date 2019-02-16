"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Message_model_1 = require("../Message/Message.model");
const ChatSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: async (slug) => await Chat.doesntExist({ slug }),
            message: () => 'שם החדר שבחרת תפוס, אנא בחר/י שם אחר'
        }
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
        type: [Message_model_1.default],
        select: false
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastMessage: String
}, { timestamps: true, collection: 'chatRooms' });
ChatSchema.statics.doesntExist = async function (opts) {
    return (await this.where(opts).countDocuments()) === 0;
};
const Chat = mongoose_1.model('Chat', ChatSchema);
exports.default = Chat;
