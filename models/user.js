const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
usernameUser: {
    type: String,
    required: true,
},
passwordUser: {
    type: String,
    required: true,
},
});

module.exports = mongoose.model("User", userSchema);
