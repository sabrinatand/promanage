const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  usernameAdmin: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+$/,
  },
  passwordAdmin: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9]+$/,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
