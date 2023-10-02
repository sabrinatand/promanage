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

  startDate: {
    type: Date,
    default: generateDate,
  },

  endDate: {
    type: Date,
  },

  duration: {
    type: Number,
  },

  dueDate: {
    type: Date,
  },
});

function generateDate() {
  return new Date();
}

module.exports = mongoose.model("Task", taskSchema);
