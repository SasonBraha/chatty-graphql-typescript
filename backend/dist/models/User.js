"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
exports.UserSchema = new mongoose_1.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: displayName => exports.UserSchema.doesntExist({ displayName }),
            message: () => 'שם המשתמש שבחרת תפוס, אנא בחר/י שם אחר'
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        select: false,
        validate: {
            validator: email => exports.UserSchema.doesntExist({ email }),
            message: () => 'כתובת דואר האלקטרוני שהזנת כבר קיימת במערכת'
        }
    },
    password: {
        type: String,
        trim: true,
        select: false
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
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
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
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
exports.UserSchema.statics.doesntExist = async function (options) {
    return await this.where(options).countDocuments() === 0;
};
exports.UserSchema.index({ displayName: 'text' });
exports.default = mongoose_1.model('User', exports.UserSchema);
