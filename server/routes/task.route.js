import express from "express";
import {
  getTasks,
  updateTaskStatus,
  deleteTask,
  getSeparatedTasks
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.put("/:id", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);  // ✔ delete route
router.get("/separate", protect, getSeparatedTasks);

export default router;
