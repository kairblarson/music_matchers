const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: mongoose.SchemaTypes.String,
    },
    viewed: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date().getTime(),
    },
});

module.exports = mongoose.model("Notification", NotificationSchema);
