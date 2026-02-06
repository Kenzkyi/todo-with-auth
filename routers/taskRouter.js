const express = require("express");
const Task = require("../models/tasks");

const taskRouter = express.Router();

taskRouter.get("/", async (req, res) => {
  const user_id = req.user._id;
  if (!user_id) return res.redirect("/");
  try {
    const allTasks = await Task.find({ user_id });
    res.status(200).json({
      message: "All tasks retrieved successfully",
      data: allTasks.reverse(),
      isError: false,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "An error occurred", data: null, isError: true });
  }
});

taskRouter.post("/", async (req, res) => {
  const user_id = req.user._id;
  if (!user_id) return res.redirect("/");
  const title = req.body.title.trim();
  if (!title) {
    req.session.formError = { error: "Please input a task" };
    res.redirect("/my-todo");
    return;
  }
  try {
    await Task.insertOne({ user_id, title });
    res.redirect("/my-todo");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "An error occurred", data: null, isError: true });
  }
});

taskRouter.patch("/:id", async (req, res) => {
  const taskInfo = req.body;
  const taskId = req.params.id;

  try {
    const lastestTask = await Task.findByIdAndUpdate(taskId, taskInfo, {
      new: true,
    });
    res
      .status(200)
      .send({ message: "Task updated successfully", data: lastestTask });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "An error occurred", data: null, isError: true });
  }
});

module.exports = taskRouter;
