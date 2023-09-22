const express = require("express");
const taskCont = require("../controllers/task-controller");

const router = express.Router();

router.post("/add-task", taskCont.createTask);

router.get("/product-backlog", taskCont.listTasks);

router.delete("/delete-task", taskCont.deleteTask);

router.put("/edit-task", taskCont.editTask);

module.exports = router;
