const mongoose = require("mongoose");
const User = require("./User");

const UserVerificationTokenSchema = new mongoose.Schema({
    token: {
        type: mongoose.SchemaTypes.String,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date().getTime(),
    },
});

module.exports = mongoose.model(
    "UserVerificationToken",
    UserVerificationTokenSchema
);
