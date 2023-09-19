const randString = require("randomstring");
const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  name: {
    type: String,
  },

  description: {
    type: String,
    default: "No Description",
  },

  startDateTime: {
    type: Date,
  },

  status: {
    type: String,
    default: "Not Started",
  },

  teamMember: {
    type: String,
  },

  priority: {
    type: String,
  },
});

module.exports = mongoose.model("Task", taskSchema);
