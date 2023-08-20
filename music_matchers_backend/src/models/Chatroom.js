const mongoose = require("mongoose");
const User = require("./User");
const Message = require("./Message");

//use the accepted prop to determine if a message is a req or a reg message
//if it has been declined straight up then it wont even show up in requests anymore
const ChatroomSchema = new mongoose.Schema({
    users: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
    },
    messages: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Message",
    },
    accepted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    declined: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date().getTime(),
    },
});

module.exports = mongoose.model("Chatroom", ChatroomSchema);
