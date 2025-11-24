import express from 'express';
import { getTasks, updateTaskStatus, regenerateTasks } from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// Route 1: GET /api/tasks - Fetch all tasks (auto-generates if needed)
router.get('/', protect, getTasks);

// Route 2: PUT /api/tasks/:id - Update task status
router.put('/:id', protect, updateTaskStatus);

// Route 3: POST /api/tasks/regenerate - Force regenerate all tasks
router.post('/regenerate', protect, regenerateTasks);

export default router;