const mongoose = require("mongoose");
const User = require("./User");
const Message = require("./Message");

const BandSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        lowercase: true,
        default: () => {
            /*call api to generate random name*/
        },
    },
    members: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "User",
    },
    verified: {
        type: mongoose.SchemaTypes.Boolean,
    },
    enabled: {
        type: mongoose.SchemaTypes.Boolean,
        requied: true,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    },
});

module.exports = mongoose.model("Band", BandSchema);
