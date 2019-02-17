"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rootSchema_1 = require("./rootSchema");
const chat_typeDefs_1 = require("../entities/Chat/chat.typeDefs");
const combinedSchema = [rootSchema_1.default, chat_typeDefs_1.default];
exports.default = combinedSchema;
