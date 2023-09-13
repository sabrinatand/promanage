const express = require("express");
const ejs = require("ejs");
const Task = require("./models/task");
// const mongoose = require("mongoose");

const app = express();
app.listen(8080);

// const MongoClient = mongodb.MongoClient;

// const url = "mongodb://127.0.0.1:27017/tasks";

// app.use(express.json());

app.use(express.static("node_modules/bootstrap/dist/css"));

app.use(express.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

let taskDB = [];
let taskDBunchanged = [];
let memberDB = [];
// async function connect() {
//   await mongoose.connect(url);
// }
// connect()
//   .catch((err) => console.log(err))
//   .then(processData);

// async function processData() {
//   console.log("Processing Data");
// }

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/add-task", function (req, res) {
  let obj = req.body;
  let aTask = new Task(obj.name, obj.description, obj.teamMember, obj.priority);
  taskDB.push(aTask);
  taskDBunchanged.push(obj.teamMember);
  res.redirect("/product-backlog");
});

app.get("/add-task", function (req, res) {
  res.render("add-task", { memberDB });
});

app.post("/add-member", function (req, res) {
  memberDB.push(req.body.memberName);
  res.redirect("/");
});

app.get("/add-member", function (req, res) {
  res.render("add-member");
});
app.get("/product-backlog", function (req, res) {
  res.render("product-backlog", { tasks: taskDB });
});

app.get("/delete-task", function (req, res) {
  res.render("delete-task");
});

app.post("/delete-task", function (req, res) {
  let id = req.body.id;
  taskDB = taskDB.filter((task) => task.id !== id);
  res.redirect("/product-backlog");
});

app.post("/change-priority/:id", function (req, res) {
  const taskId = req.params.id;
  const newPriority = req.body.newPriority;
  for (let i = 0; i < taskDB.length; i++) {
    if (taskDB[i].id == taskId) {
      taskDB[i].priority = newPriority;
      break;
    }
  }
  res.redirect(`/edit-task/${taskId}`);
});

app.post("/change-status/:id", function (req, res) {
  const taskId = req.params.id;
  const newStatus = req.body.newStatus;
  for (let i = 0; i < taskDB.length; i++) {
    if (taskDB[i].id == taskId) {
      taskDB[i].status = newStatus;
      break;
    }
  }
  res.redirect(`/edit-task/${taskId}`);
});

app.post("/change-teamMember/:id", function (req, res) {
  const taskId = req.params.id;
  const newMember = req.body.newMember;
  for (let i = 0; i < taskDB.length; i++) {
    if (taskDB[i].id == taskId) {
      taskDB[i].teamMember = newMember;
      break;
    }
  }
  res.redirect(`/edit-task/${taskId}`);
});

app.post("/change-name/:id", function (req, res) {
  const taskId = req.params.id;
  const name = req.body.name;
  for (let i = 0; i < taskDB.length; i++) {
    if (taskDB[i].id == taskId) {
      taskDB[i].name = name;
      break;
    }
  }
  res.redirect(`/edit-task/${taskId}`);
});

app.post("/change-description/:id", function (req, res) {
  const taskId = req.params.id;
  const description = req.body.description;
  for (let i = 0; i < taskDB.length; i++) {
    if (taskDB[i].id == taskId) {
      taskDB[i].description = description;
      break;
    }
  }
  res.redirect(`/edit-task/${taskId}`);
});

app.get("/task-detail/:taskId", function (req, res) {
  let taskId = req.params.taskId;
  let task = taskDB.find((e) => e.id === taskId);
  if (task) res.render("task-detail", { task: task });
  else res.status(404).send("Task not found");
});

app.get("/edit-task/:taskId", function (req, res) {
  let taskId = req.params.taskId;
  let task = taskDB.find((e) => e.id === taskId);
  if (task)
    res.render("edit-task", { task: task, tasksunchanged: taskDBunchanged });
  else res.status(404).send("Task not found");
});
