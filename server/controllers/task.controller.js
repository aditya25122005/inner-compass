import asyncHandler from "express-async-handler";
import Task from "../models/Task.model.js";

// --------------------------------------------------------
// 1) GET ALL TASKS
// --------------------------------------------------------
export const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let tasks = await Task.find({ user: userId }).sort({ assignedDate: -1 });

  if (tasks.length === 0) {
    await Task.insertMany([
      { user: userId, title: "Journal 3 things you are grateful for", category: "Wellness" },
      { user: userId, title: "Do 5 minutes of Deep Breathing", category: "Mindfulness" },
      { user: userId, title: "Take a 10-minute walk", category: "Activity" }
    ]);

    tasks = await Task.find({ user: userId }).sort({ assignedDate: -1 });
  }

  res.status(200).json(tasks);
});

// --------------------------------------------------------
// 2) UPDATE TASK STATUS
// --------------------------------------------------------
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: req.user._id },
    { isCompleted: req.body.isCompleted },
    { new: true }
  );

  if (!task) {
    res.status(404);
    throw new Error("Task not found or user not authorized.");
  }

  res.status(200).json({
    message: "Task updated successfully",
    task,
  });
});

// --------------------------------------------------------
// 3) DELETE TASK (NEW)
// --------------------------------------------------------
export const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const deleted = await Task.findOneAndDelete({
    _id: taskId,
    user: req.user._id,
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Task not found or not authorized.");
  }

  res.status(200).json({ message: "Task deleted successfully." });
});

// --------------------------------------------------------
// 4) SEPARATED TASKS (AI + ROUTINE)
// --------------------------------------------------------
export const getSeparatedTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const aiTasks = await Task.find({ user: userId, category: "AI" }).sort({ createdAt: -1 });

  const routineTasks = await Task.find({
    user: userId,
    category: { $in: ["Wellness", "Mindfulness", "Activity", "Social"] },
  }).sort({ createdAt: -1 });

  res.status(200).json({ aiTasks, routineTasks });
});
