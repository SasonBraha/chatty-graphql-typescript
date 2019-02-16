"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const app_1 = require("../app");
const _1 = require("./");
const NotificationSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
NotificationSchema.post('find', (notifications) => {
    notifications.forEach(notification => !notification.isSeen && (notification.isSeen = true,
        notification.save()));
});
NotificationSchema.post('save', async (notification) => {
    // Check If Notifications Is New (To Prevent { Schema.post('find') } From Emitting Notification)
    if (notification.isNew) {
        // Populate Receiver Credentials
        const popultedNotification = await notification
            .populate('receiver', 'slug')
            .execPopulate();
        // Emit Notification
        app_1.io.to(popultedNotification.receiver.slug).emit('server:newNotification', popultedNotification.content);
        // Save Notificationn Refrence In { User<Schema> }
        await _1.User.findOneAndUpdate({ _id: notification.receiver }, { $push: { notifications: notification._id } });
    }
});
exports.default = mongoose_1.model('Notification', NotificationSchema);
