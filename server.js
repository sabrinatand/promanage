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
  res.redirect("/product-backlog");
});

app.get("/add-task", function (req, res) {
  res.render("add-task");
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

app.get("/change-priority", function (req, res) {
  res.render("change-priority", { tasks: taskDB});
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
  res.redirect("/change-priority");
});

app.get("/sort-by-priority", function (req, res) {
  const taskDB_Low = [];
  const taskDB_Medium = [];
  const taskDB_High = [];
  const taskDB_Urgent = [];
  for (let i = 0; i < taskDB.length; i++) {
    if (taskDB[i].priority === "Low") {
        taskDB_Low.push(taskDB[i]);
    }
    else if (taskDB[i].priority === "Medium") {
      taskDB_Medium.push(taskDB[i]);
    }
    else if (taskDB[i].priority === "High") {
      taskDB_High.push(taskDB[i]);
    }
    else {
      taskDB_Urgent.push(taskDB[i]);
    }
  }
  res.render("sort-by-priority", { LowPriority: taskDB_Low, MedPriority: taskDB_Medium, HighPriority: taskDB_High, UrgPriority: taskDB_Urgent, tasks: taskDB });
});