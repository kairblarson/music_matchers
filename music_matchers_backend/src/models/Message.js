const mongoose = require("mongoose");
const User = require("./User");
const Band = require("./Band");

const MessageSchema = new mongoose.Schema({
    reciever: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    content: {
        type: mongoose.SchemaTypes.String,
    },
    viewedBy: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
    },
    createdAt: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: () => {
            return new Date().getTime();
        },
    },
});

module.exports = mongoose.model("Message", MessageSchema);
