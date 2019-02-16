"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.FileSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: [
            'jpg', 'jpeg',
            'png', 'gif',
            'webp', 'bmp'
        ],
        required: true
    },
    link: {
        type: String,
        required: true
    },
    dimensions: {
        height: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        }
    }
});
