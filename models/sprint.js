const mongoose = require("mongoose");

const sprintSchema = mongoose.Schema ({
    numberOfSprints: {
        type: Number,
        enum: [1, 2, 3], // Allow only 1, 2, or 3 sprints
        required: true,
      },
      duration: {
        type: Number,
        min: 1, // Minimum duration is 1 week
        required: true,
      },
    startDate:{
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        default: function () {
            return this.calculateEndDate();
        }
    },
});

sprintSchema.methods.calculateEndDate = function () {
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + (7 * this.sprintDurationWeeks));
    return endDate;
  };

module.exports = mongoose.model("Sprint", sprintSchema);