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
