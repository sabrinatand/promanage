const randString = require("randomstring");

// const mongoose = require("mongoose");

// const taskSchema = mongoose.Schema({
//   name: String,
//   description: String,
// });

// module.exports = mongoose.model("task", taskSchema);

class Task {
  constructor(
    name,
    description = "No Description",
    teamMember = "None",
    priority = "Low"
  ) {
    this.name = name;
    this.description = description;
    this.status = "Not Started";
    this.id =
      "E" +
      randString.generate({
        length: 2,
        charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      }) +
      "-" +
      Math.round(Math.random() * 1000);
    this.teamMember = teamMember;
    this.priority = priority;
  }
}

module.exports = Task;
