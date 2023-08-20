const mongoose = require("mongoose");

const BandInviteSchema = new mongoose.Schema({
    band: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Band",
    },
    to: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    from: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    accepted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    declined: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    viewed: {
        type: mongoose.SchemaTypes.Boolean,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date().getTime(),
    },
});

module.exports = mongoose.model("BandInvite", BandInviteSchema);
