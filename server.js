const express = require("express");
const ejs = require("ejs");
const Task = require("./models/task");
const Member = require("./models/members");
const Sprint = require("./models/sprint");
const mongoose = require("mongoose");
const taskRouter = require("./routes/task-route");

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

app.use(express.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.listen(8080);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/add-task", async function (req, res) {
  let members = await Member.find({});
  res.render("add-task", { members: members });
});

app.post("/add-task", async function (req, res) {
  try {
    let obj = req.body;

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
});

app.get("/product-backlog", async function (req, res) {
  try {
    let tasks = await Task.find({});
    res.render("product-backlog", { tasks: tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/delete-task", function (req, res) {
  res.render("delete-task");
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
    res.render("task-detail", { task: theTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/edit-task/:taskId", async function (req, res) {
  try {
    let taskId = req.params.taskId;
    let theTask = await Task.findOne({ _id: taskId });
    let members = await Member.find({});
    res.render("edit-task", { task: theTask, members: members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/edit-task/:taskId", async function (req, res) {
  try {
    let taskId = req.params.taskId;
    let obj = req.body;
    await Task.updateOne({ _id: taskId }, obj);
    res.redirect("/product-backlog");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/add-member", function (req, res) {
  res.render("add-member");
});

app.post("/add-member", async function (req, res) {
  let newMember = new Member({
    name: req.body.name,
  });
  await newMember.save();
  res.redirect("/");
});


app.get("/sprint", async function(req, res) {
  let sprint = await Sprint.find({});
  res.render("sprint-detail", {sprints: sprint});
})

app.get("/add-sprint", async function(req, res) {
  res.render("add-sprint");
})
app.post("/add-sprint", async function(req, res) {
    const numberOfSprints = parseInt(req.body.numberOfSprints);
    const startDate = new Date(req.body.startDate);
    const duration = parseInt(req.body.duration);

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Create an array to store Sprint details
    const sprintDetails = [];

    // Calculate Sprint details based on user input
    for (let i = 1; i <= numberOfSprints; i++) {
      const sprintStartDate = new Date(startDate);
      const sprintEndDate = new Date(startDate);
      sprintEndDate.setDate(sprintEndDate.getDate() + (duration * 7));

      const currentYear = sprintStartDate.getFullYear();

      const formattedStartDate = `${sprintStartDate.getDate()} ${months[sprintStartDate.getMonth()]} ${currentYear}`;
      const formattedEndDate = `${sprintEndDate.getDate()} ${months[sprintEndDate.getMonth()]} ${currentYear}`;

        // Create and push Sprint detail object to the array
      sprintDetails.push({
          numberOfSprints: i,
          duration: duration,
          startDate: formattedStartDate,
          endDate: formattedEndDate
      });

        // Update startDate for the next sprint
      startDate.setDate(sprintEndDate.getDate() + 1);
    }
    const savedSprints = await Sprint.insertMany(sprintDetails);

    res.redirect('/sprint');
})

app.post('/delete-sprints', async (req, res) => {
  try {
    await Sprint.deleteMany({});
    res.redirect('/sprint');
  } catch (error) {
    res.status(500).send('Error deleting sprints');
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
