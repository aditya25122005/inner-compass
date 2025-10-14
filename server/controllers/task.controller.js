import asyncHandler from 'express-async-handler';
import Task from '../models/Task.model.js'


const getTasks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    console.log(userId);

    let tasks = await Task.find({ user: userId }).sort({ assignedDate: -1 });

    if (tasks.length === 0) {
        console.log("No tasks found. Inserting initial mock tasks...");
        
        try {
            await Task.insertMany([
                { user: userId, title: "Journal 3 things you are grateful for", category: "Wellness", isCompleted: false },
                { user: userId, title: "Do 5 minutes of Deep Breathing", category: "Mindfulness", isCompleted: false },
                { user: userId, title: "Take a 10-minute walk", category: "Activity", isCompleted: false },
            ]);
            tasks = await Task.find({ user: userId }).sort({ assignedDate: -1 });
            
        } catch (error) {
            console.error("CRITICAL: Failed to insert mock tasks due to MongoDB error:", error.message);
            
            return res.status(200).json([]); 
        }
    }
    
    res.status(200).json(tasks);
});


const updateTaskStatus = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const { isCompleted } = req.body; 

    
    const task = await Task.findOneAndUpdate(
        { _id: taskId, user: req.user._id },
        { isCompleted },
        { new: true }
    );

    if (!task) {
        res.status(404);
        throw new Error('Task not found or user not authorized.');
    }

    res.status(200).json({
        message: 'Task status updated successfully.',
        task,
    });
});

export { getTasks, updateTaskStatus };
