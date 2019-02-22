"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const File_model_1 = require("./File.model");
const MessageSchema = new mongoose_1.Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },
    file: {
        type: File_model_1.File
    },
    createdBy: {
        _id: String,
        displayName: String,
        slug: String
    }
}, { timestamps: true });
const Message = mongoose_1.model('Message', MessageSchema);
exports.default = Message;
