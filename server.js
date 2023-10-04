const express = require("express");
const ejs = require("ejs");
const Task = require("./models/task");
const Member = require("./models/members");
const Sprint = require("./models/sprint");
const mongoose = require("mongoose");
const taskRouter = require("./routes/task-route");
const path = require("path");

const url = "mongodb://127.0.0.1:27017/tasks";

async function connect(url) {
  await mongoose.connect(url);
  return "Connected Successfully";
}

connect(url)
  .then(console.log)
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

// app.use("", taskRouter);

app.use(express.static("node_modules/bootstrap/dist/css"));
app.use("/image", express.static(path.join(__dirname, "image")));
app.use(express.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.listen(8080);

app.get("/", async function (req, res) {
  let sprint = await Sprint.find({});
  res.render("index", { sprints: sprint });
});

app.get("/add-task", async function (req, res) {
  let members = await Member.find({});
  res.render("add-task", { members: members });
});

app.post("/add-task", async function (req, res) {
  try {
    let obj = req.body;

    if (obj.startDate === "2023-01-01T00:00") {
      let startDate = new Date();
      obj.startDate = startDate;
    } else {
      let startDate = new Date(obj.startDate);
    }
    if (obj.dueDate === "2023-01-01T00:00") {
      let dueDate = new Date();
      obj.dueDate = dueDate;
    } else {
      let dueDate = new Date(obj.startDate);
    }

    const startDate = new Date(obj.startDate);
    const dueDate = new Date(obj.dueDate);
    const durationMiliseconds = dueDate.getTime() - startDate.getTime();
    const total_seconds = parseInt(Math.floor(durationMiliseconds / 1000));
    const total_minutes = parseInt(Math.floor(total_seconds / 60));
    const total_hours = parseInt(Math.floor(total_minutes / 60));
    const duration = parseInt(Math.floor(total_hours / 24)) + 1;
    let status = obj.status;
    const today = new Date();
    if (startDate < today) {
      status = "In Progress";
    }

    let theTask = new Task({
      name: obj.name,
      status: status,
      description: obj.description,
      startDateTime: obj.startDateTime,
      teamMember: obj.teamMember,
      priority: obj.priority,
      startDate: startDate,
      endDate: obj.endDate,
      duration: duration,
      dueDate: dueDate,
    });

    await theTask.save();
    res.redirect("/product-backlog");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/product-backlog", async function (req, res) {
  try {
    let tasks = await Task.find({});
    res.render("product-backlog", { tasks: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/delete-task/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await Task.deleteOne({ _id: id });
    res.redirect("/product-backlog");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/task-detail/:taskId", async function (req, res) {
  try {
    let taskId = req.params.taskId;
    let theTask = await Task.findOne({ _id: taskId });
    let sprints = await Sprint.find({});
    res.render("task-detail", { task: theTask, sprint: sprints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/edit-task/:taskId", async function (req, res) {
  try {
    let taskId = req.params.taskId;
    let theTask = await Task.findOne({ _id: taskId });
    let members = await Member.find({});
    let sprint = await Sprint.find({});
    res.render("edit-task", {
      task: theTask,
      members: members,
      sprint: sprint,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/edit-task/:taskId", async function (req, res) {
  try {
    let taskId = req.params.taskId;
    let obj = req.body;
    let task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (obj.name === "") {
      obj.name = task.name;
    }
    if (obj.description === "") {
      obj.description = task.description;
    }
    if (obj.teamMember === "") {
      obj.teamMember = task.teamMember;
    }
    if (obj.priority === "") {
      obj.priority = task.priority;
    }
    if (obj.startDate === "2023-01-01T00:00") {
      obj.startDate = task.startDate;
      startDate = obj.startDate;
    } else {
      startDate = new Date(obj.startDate);
    }
    if (obj.dueDate === "2023-01-01T00:00") {
      obj.dueDate = task.dueDate;
      dueDate = obj.dueDate;
    } else {
      dueDate = new Date(obj.dueDate);
    }

    const durationMiliseconds = dueDate.getTime() - startDate.getTime();
    const total_seconds = parseInt(Math.floor(durationMiliseconds / 1000));
    const total_minutes = parseInt(Math.floor(total_seconds / 60));
    const total_hours = parseInt(Math.floor(total_minutes / 60));
    let duration = parseInt(Math.floor(total_hours / 24)) + 1;
    obj.duration = duration;
    let status = obj.status;
    const today = new Date();
    if (startDate < today) {
      status = "In Progress";
    }

    task.endDate = null;
    task.status = status;
    await task.save();

    await Task.updateOne({ _id: taskId }, obj);
    res.redirect("/product-backlog");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/change-sprint/:id", async function (req, res) {
  const taskId = req.params.id;
  const sprintId = req.body.newSprint;
  let theTask = await Task.findOne({ _id: taskId });
  let theSprint = await Sprint.findOne({ _id: sprintId });
  theTask.sprint.push(theSprint._id);
  theSprint.taskList.push(theTask._id);

  console.log(theTask.sprint[0]);
  if (theTask.sprint[0] !== theSprint._id) {
    let oldSprint = await Sprint.findOne({ _id: theTask.sprint[0] });
    oldSprint.taskList.pull({ _id: theTask._id });
    theTask.sprint.pull({ _id: oldSprint._id });
    await oldSprint.save();
  }

  await theTask.save();
  await theSprint.save();

  res.redirect(`/sprint-detail/${sprintId}`);
});

app.get("/add-member", async function (req, res) {
  let memebers = await Member.find({});
  res.render("add-member", { members: memebers });
});

app.post("/add-member", async function (req, res) {
  let newMember = new Member({
    name: req.body.name,
  });
  await newMember.save();
  res.redirect("/add-member");
});

app.get("/delete-member/:id", async function (req, res) {
  let id = req.params.id;
  await Member.deleteOne({ _id: id });
  res.redirect("/add-member");
});

app.get("/finish-task/:taskId", async function (req, res) {
  try {
    let taskId = req.params.taskId;
    let task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.endDate = new Date();
    task.status = "Finished";
    await task.save();

    res.redirect("/product-backlog");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/burndown-chart", function (req, res) {
  res.render("burndown-chart");
});

app.get("/sprint", async function (req, res) {
  let sprint = await Sprint.find({});
  res.render("sprint", { sprints: sprint });
});

app.get("/add-sprint", function (req, res) {
  res.render("add-sprint");
});

app.post("/add-sprint", async function (req, res) {
  try {
    let aSprint = new Sprint({
      name: req.body.name,
      startDate: new Date(req.body.startDate),
      duration: parseInt(req.body.duration),
    });
    await aSprint.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/delete-sprint", async function (req, res) {
  try {
    const sprintId = req.body.sprintId;
    await Sprint.findByIdAndRemove(sprintId);
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/sprint-detail/:sprintId", async function (req, res) {
  try {
    let sprintId = req.params.sprintId;
    let sprint = await Sprint.findOne({ _id: sprintId });
    let tasks = await Task.find({ _id: sprint.taskList });
    if (sprint) res.render("sprint-detail", { sprint: sprint, tasks: tasks });
  } catch {
    res.status(404).send("Sprint not found");
  }
});

app.get("/task-archive/:id", async function (req, res) {
  try {
    let id = req.params.id;
    let theTask = await Task.findOne({ _id: id });
    let theSprint = await Sprint.findOne({ _id: theTask.sprint });

    theTask.sprint.pull({ _id: theSprint._id });
    theSprint.taskList.pull({ _id: theTask._id });

    await theTask.save();
    await theSprint.save();

    res.redirect(`/sprint-detail/${theSprint._id}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/sprint", async function (req, res) {
  let sprint = await Sprint.find({});
  res.render("sprint-detail", { sprints: sprint });
});

app.get("/add-sprint", function (req, res) {
  res.render("add-sprint");
});

app.post("/add-sprint", async function (req, res) {
  try {
    const startDate = new Date(req.body.startDate);
    let status = req.body.status;
    const today = new Date();

    if (startDate < today) {
      status = "In Progress";
    }

    let aSprint = new Sprint({
      name: req.body.name,
      status: status,
      startDate: startDate,
      duration: parseInt(req.body.duration),
    });
    await aSprint.save();
    res.redirect("/sprint");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/start-sprint/:sprintId", async function (req, res) {
  try {
    let sprintId = req.params.sprintId;
    let sprint = await Sprint.findOne({ _id: sprintId });

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    sprint.status = "In Progress";
    await sprint.save();

    res.redirect("/sprint");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/stop-sprint/:sprintId", async function (req, res) {
  try {
    let sprintId = req.params.sprintId;
    let sprint = await Sprint.findOne({ _id: sprintId });

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    sprint.status = "Not Started";
    await sprint.save();

    res.redirect("/sprint");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/finish-sprint/:sprintId", async function (req, res) {
  try {
    let sprintId = req.params.sprintId;
    let sprint = await Sprint.findOne({ _id: sprintId });

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    sprint.status = "Finished";
    await sprint.save();

    res.redirect("/sprint");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/delete-sprint", async function (req, res) {
  try {
    const sprintId = req.body.sprintId;
    await Sprint.findByIdAndRemove(sprintId);
    res.redirect("/sprint");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.post("/add-task", function (req, res) {
//   let obj = req.body;
//   let aTask = new Task(obj.name, obj.description, obj.teamMember, obj.priority);
//   taskDB.push(aTask);
//   taskDBunchanged.push(obj.teamMember);
//   res.redirect("/product-backlog");
// });

// app.get("/add-task", function (req, res) {
//   res.render("add-task", { memberDB });
// });

// app.post("/add-member", function (req, res) {
//   memberDB.push(req.body.memberName);
//   res.redirect("/");
// });

// app.get("/add-member", function (req, res) {
//   res.render("add-member");
// });
// app.get("/product-backlog", function (req, res) {
//   res.render("product-backlog", { tasks: taskDB });
// });

// app.get("/delete-task", function (req, res) {
//   res.render("delete-task");
// });

// app.post("/delete-task", function (req, res) {
//   let id = req.body.id;
//   taskDB = taskDB.filter((task) => task.id !== id);
//   res.redirect("/product-backlog");
// });

// app.post("/change-priority/:id", function (req, res) {
//   const taskId = req.params.id;
//   const newPriority = req.body.newPriority;
//   for (let i = 0; i < taskDB.length; i++) {
//     if (taskDB[i].id == taskId) {
//       taskDB[i].priority = newPriority;
//       break;
//     }
//   }
//   res.redirect(`/edit-task/${taskId}`);
// });

// app.post("/change-status/:id", function (req, res) {
//   const taskId = req.params.id;
//   const newStatus = req.body.newStatus;
//   for (let i = 0; i < taskDB.length; i++) {
//     if (taskDB[i].id == taskId) {
//       taskDB[i].status = newStatus;
//       break;
//     }
//   }
//   res.redirect(`/edit-task/${taskId}`);
// });

// app.post("/change-teamMember/:id", function (req, res) {
//   const taskId = req.params.id;
//   const newMember = req.body.newMember;
//   for (let i = 0; i < taskDB.length; i++) {
//     if (taskDB[i].id == taskId) {
//       taskDB[i].teamMember = newMember;
//       break;
//     }
//   }
//   res.redirect(`/edit-task/${taskId}`);
// });

// app.post("/change-name/:id", function (req, res) {
//   const taskId = req.params.id;
//   const name = req.body.name;
//   for (let i = 0; i < taskDB.length; i++) {
//     if (taskDB[i].id == taskId) {
//       taskDB[i].name = name;
//       break;
//     }
//   }
//   res.redirect(`/edit-task/${taskId}`);
// });

// app.post("/change-description/:id", function (req, res) {
//   const taskId = req.params.id;
//   const description = req.body.description;
//   for (let i = 0; i < taskDB.length; i++) {
//     if (taskDB[i].id == taskId) {
//       taskDB[i].description = description;
//       break;
//     }
//   }
//   res.redirect(`/edit-task/${taskId}`);
// });

// app.get("/task-detail/:taskId", function (req, res) {
//   let taskId = req.params.taskId;
//   let task = taskDB.find((e) => e.id === taskId);
//   if (task) res.render("task-detail", { task: task });
//   else res.status(404).send("Task not found");
// });

// app.get("/edit-task/:taskId", function (req, res) {
//   let taskId = req.params.taskId;
//   let task = taskDB.find((e) => e.id === taskId);
//   if (task)
//     res.render("edit-task", { task: task, tasksunchanged: taskDBunchanged });
//   else res.status(404).send("Task not found");
// });
