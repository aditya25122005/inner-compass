import asyncHandler from 'express-async-handler';
import Journal from '../models/journalEntry.model.js'; 
import Task from '../models/Task.model.js'; 
import { calculateMetrics } from '../utils/dashboardUtils.js';


const getDashboardData = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const journalEntries = await Journal.find({ user: userId }).select('analysis mood').sort({ createdAt: -1 });
    const tasks = await Task.find({ user: userId }).select('isCompleted assignedDate').sort({ assignedDate: -1 });
    const metrics = calculateMetrics(journalEntries, tasks);
    res.status(200).json({
        success: true,
        data: metrics
    });
});

export { getDashboardData };