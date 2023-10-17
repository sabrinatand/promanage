const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    usernameUser: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9]+$/,
    },
    passwordUser: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9]+$/,
    },
    UserID : {
        type : Number,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);
