const Task = require("../models/task");

module.exports = {
  createTask: async function (req, res) {
    try {
      let obj = req.body;
      console.log(obj);

      let theTask = new Task({
        name: obj.name,
        description: obj.description,
        startDateTime: obj.startDateTime,
        teamMember: obj.teamMember,
        priority: obj.priority,
      });

      await theTask.save();
      res.redirect("/product-backlog");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  listTasks: async function (req, res) {
    try {
      let tasks = await Task.find({});
      res.render("product-backlog", { tasks: tasks });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteTask: async function (req, res) {
    try {
      let id = req.query.id;
      await Task.deleteOne({ _id: id });
      res.redirect("/product-backlog");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  editTask: async function (req, res) {
    try {
      let taskId = req.params.id;
      let obj = req.body;
      await Task.updateOne({ _id: taskId }, obj);
      res.redirect("/product-backlog");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
