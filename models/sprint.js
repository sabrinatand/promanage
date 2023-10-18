const mongoose = require("mongoose");

const sprintSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Not Started",
  },
  duration: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: function () {
      return this.calculateEndDate();
    },
  },
  taskList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  taskNumber: {
    type: Number,
    default: 0,
  },
  taskFinished: [{ type: Number, default: 0 }],
});

sprintSchema.methods.calculateEndDate = function () {
  const endDate = new Date(this.startDate);
  endDate.setDate(endDate.getDate() + this.duration);
  return endDate;
};

module.exports = mongoose.model("Sprint", sprintSchema);
