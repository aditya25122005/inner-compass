import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Trash2, Zap, Target, XCircle, ArrowLeft, Loader2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api'; 


const DailyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('pending'); // pending, completed, all

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all tasks from the backend
            const data = await taskAPI.getTasks();
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError("Failed to load tasks. Please ensure the backend is running and you are logged in.");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleTaskCompletion = async (taskId, isCurrentlyCompleted) => {
        setTasks(tasks.map(task => 
            task._id === taskId ? { ...task, isCompleted: !isCurrentlyCompleted } : task
        ));

        try {
            await taskAPI.updateTaskStatus(taskId, !isCurrentlyCompleted);
            fetchTasks(); 
        } catch (err) {
            setTasks(tasks.map(task => 
                task._id === taskId ? { ...task, isCompleted: isCurrentlyCompleted } : task
            ));
            alert("Failed to update task status. Please try again.");
            console.error("Task update error:", err);
        }
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.isCompleted;
        if (filter === 'pending') return !task.isCompleted;
        return true;
    });

    const getFilterStyle = (currentFilter) => 
        filter === currentFilter ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100';
    
   
    const getTaskTime = (task) => task.assignedDate ? new Date(task.assignedDate).toLocaleDateString() : 'Today';

    if (error) {
        return <div className="text-center p-12 text-red-600 bg-red-100 max-w-6xl mx-auto mt-10 rounded-lg">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Your Daily Task Manager</h1>
                </div>

                {/* Progress Tracker Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200 mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-indigo-600" /> Daily Compliance
                        </h3>
                        <span className="text-2xl font-bold text-indigo-600">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {completedTasks} of {totalTasks} tasks completed today. Keep the streak going!
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="flex space-x-4 mb-6">
                    <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-full font-medium transition-all ${getFilterStyle('pending')}`}>
                        <Clock className="w-4 h-4 inline mr-2" /> Pending ({pendingTasks})
                    </button>
                    <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded-full font-medium transition-all ${getFilterStyle('completed')}`}>
                        <CheckSquare className="w-4 h-4 inline mr-2" /> Completed ({completedTasks})
                    </button>
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full font-medium transition-all ${getFilterStyle('all')}`}>
                        <Zap className="w-4 h-4 inline mr-2" /> All Tasks ({totalTasks})
                    </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
                            <Loader2 className="w-8 h-8 mx-auto text-indigo-500 animate-spin mb-4" />
                            <p className="text-lg text-gray-600">Fetching personalized tasks...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
                            <XCircle className="w-10 h-10 mx-auto text-gray-400 mb-4" />
                            <p className="text-lg text-gray-600">No tasks found for this filter. Start journaling to get recommendations!</p>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <div 
                                key={task._id}
                                className={`flex items-center p-4 rounded-xl shadow-sm transition-all duration-300 ${task.isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:shadow-lg'}`}
                            >
                                {/* Checkbox/Status */}
                                <button 
                                    onClick={() => toggleTaskCompletion(task._id, task.isCompleted)}
                                    className={`p-2 rounded-full transition-colors mr-4 flex-shrink-0 ${task.isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-indigo-400'}`}
                                    aria-label={`Mark task ${task.title} as ${task.isCompleted ? 'incomplete' : 'complete'}`}
                                >
                                    <CheckSquare className={`w-6 h-6 text-white ${task.isCompleted ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
                                </button>
                                
                                {/* Task Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-lg font-semibold ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex space-x-3 text-sm mt-1 text-gray-500">
                                        {/* Display task category (from model) */}
                                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">{task.category || 'General'}</span>
                                        <span className="flex items-center text-xs">
                                            <Clock className="w-3 h-3 mr-1" /> {getTaskTime(task)}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Delete Button (Implementation can be added later) */}
                                <button className="p-2 ml-4 text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyTasksPage;