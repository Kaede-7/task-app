const express = require("express");
const router = express.Router();
const taskController = require("../Controller/TaskController");

router.get("/", taskController.getAllTasks);
router.post("/create", taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
