"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
exports.User = User_1.default;
const Chat_1 = require("./Chat");
exports.Chat = Chat_1.default;
const Notification_1 = require("./Notification");
exports.Notification = Notification_1.default;
const Joi = require("joi");
const UserSchemaValidator = Joi.object().keys({
    displayName: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    slug: Joi.string(),
    avatar: Joi.string(),
});
exports.UserSchemaValidator = UserSchemaValidator;
const ChatSchemaValidator = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(17).required(),
    image: Joi.string(),
    isPrivate: Joi.boolean().strict(),
    storeMessages: Joi.boolean().strict(),
});
exports.ChatSchemaValidator = ChatSchemaValidator;
