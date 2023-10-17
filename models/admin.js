const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  usernameAdmin: {
    type: String,
    required: true,
  },
  passwordAdmin: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
