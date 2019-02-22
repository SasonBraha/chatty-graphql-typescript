"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
exports.UserSchema = new mongoose_1.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    avatar: {
        type: String,
        trim: true,
        default: '/images/default_profile.svg'
    },
    notifications: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Notification',
        select: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Moderator', 'User'],
        default: 'User'
    },
    ipAddress: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    lastActivity: {
        type: Date
    },
    jwtId: {
        type: String,
        required: true
    }
}, { timestamps: true });
// Hash Password Before Saving
exports.UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});
// Compare Password Method
exports.UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return Promise.resolve(isMatch);
    }
    catch (ex) {
        return Promise.reject(ex);
    }
};
exports.default = mongoose_1.model('User', exports.UserSchema);
