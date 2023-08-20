const mongoose = require("mongoose");
const Message = require("./Message");

//change types to guitarist/singer/band etc... band will have a members list but others wont
//when querying for users look for what the person is interested and query based off that
//improve the algo for getting the next user, if there are users available i dont want to see none available
const UserSchema = new mongoose.Schema({
    type: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    email: {
        type: mongoose.SchemaTypes.String,
    },
    password: {
        type: mongoose.SchemaTypes.String,
    },
    location: {
        type: {
            city: {
                type: mongoose.SchemaTypes.String,
            },
            state: {
                type: mongoose.SchemaTypes.String,
            },
        },
    },
    genre: {
        type: [mongoose.SchemaTypes.String],
    },
    lookingFor: {
        type: [mongoose.SchemaTypes.String],
    },
    band: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Band",
    },
    members: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
    },
    link: {
        type: mongoose.SchemaTypes.String,
    },
    images: {
        type: [mongoose.SchemaTypes.String],
    },
    demos: {
        type: [mongoose.SchemaTypes.String],
    },
    chatrooms: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Chatroom",
    },
    viewedUsers: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
    },
    swipes: {
        type: {
            numOfSwipes: {
                type: mongoose.SchemaTypes.Number,
            },
            lastSwipedDate: {
                type: mongoose.SchemaTypes.Date,
                default: new Date(),
            },
        },
    },
    verified: {
        type: mongoose.SchemaTypes.Boolean,
    },
    stripeId: {
        type: mongoose.SchemaTypes.String,
    },
    radius: {
        type: mongoose.SchemaTypes.Number,
    },
    distanceBetweenUsers: {
        type: mongoose.SchemaTypes.Number,
    },
    bandInvites: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "BandInvite",
    },
    additionalInfo: {
        type: mongoose.SchemaTypes.String,
        default: "",
    },
    enabled: {
        type: mongoose.SchemaTypes.Boolean,
        requied: true,
        default: true,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date().getTime(),
    },
});

module.exports = mongoose.model("User", UserSchema);
