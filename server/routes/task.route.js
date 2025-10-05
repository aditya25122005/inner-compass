import express from 'express';
import { getTasks, updateTaskStatus } from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// Route 1: GET /api/tasks - Fetch all tasks
router.get('/', protect, getTasks);

// Route 2: PUT /api/tasks/:id - Update task status
router.put('/:id', protect, updateTaskStatus);

export default router;