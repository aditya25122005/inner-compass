import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Trash2, Zap, Target, XCircle, ArrowLeft, Loader2, Filter, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import axios from 'axios'; 


const DailyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('pending'); // pending, completed, all
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all tasks from the backend (auto-generates if needed)
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

    const regenerateTasks = async () => {
        if (!window.confirm('This will delete all current tasks and generate 4 new personalized tasks. Continue?')) {
            return;
        }
        
        setRegenerating(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('https://inner-compass-seven.vercel.app/api/tasks/regenerate', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data.tasks);
        } catch (err) {
            console.error("Failed to regenerate tasks:", err);
            alert("Failed to regenerate tasks. Please try again.");
        } finally {
            setRegenerating(false);
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

    const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return 'No expiration';
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry - now;
        
        if (diff < 0) return 'Expired';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    const getPriorityColor = (priority) => {
        if (priority === 'high') return 'bg-red-100 text-red-700';
        if (priority === 'medium') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Mindfulness': return '🧘';
            case 'Activity': return '🏃';
            case 'Social': return '👥';
            case 'Sleep': return '😴';
            case 'Nutrition': return '🥗';
            default: return '💚';
        }
    };

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
                    <div className="flex items-center space-x-4">
                        <h1 className="text-3xl font-extrabold text-gray-900">AI-Powered Daily Tasks</h1>
                        <button
                            onClick={regenerateTasks}
                            disabled={regenerating}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                            <span>{regenerating ? 'Generating...' : 'Regenerate Tasks'}</span>
                        </button>
                    </div>
                </div>

                {/* AI Task Info Banner */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-purple-900 mb-1">AI-Generated Wellness Tasks</h3>
                            <p className="text-sm text-purple-800">
                                These 4 personalized tasks are generated by Gemini AI based on your mental health analysis, 
                                recent journal entries, and mood patterns. Tasks automatically reset every 24 hours.
                            </p>
                        </div>
                    </div>
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
                                className={`p-5 rounded-xl shadow-md transition-all duration-300 border-2 ${
                                    task.isCompleted 
                                        ? 'bg-green-50 border-green-300' 
                                        : 'bg-white border-gray-200 hover:shadow-xl hover:border-indigo-300'
                                }`}
                            >
                                <div className="flex items-start">
                                    {/* Checkbox/Status */}
                                    <button 
                                        onClick={() => toggleTaskCompletion(task._id, task.isCompleted)}
                                        className={`p-2.5 rounded-full transition-all mr-4 flex-shrink-0 ${
                                            task.isCompleted 
                                                ? 'bg-green-500 hover:bg-green-600 shadow-md' 
                                                : 'bg-gray-200 hover:bg-indigo-500 hover:shadow-lg'
                                        }`}
                                        aria-label={`Mark task ${task.title} as ${task.isCompleted ? 'incomplete' : 'complete'}`}
                                    >
                                        <CheckSquare className={`w-6 h-6 text-white ${task.isCompleted ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />
                                    </button>
                                    
                                    {/* Task Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className={`text-lg font-bold ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                {getCategoryIcon(task.category)} {task.title}
                                            </h3>
                                            {task.priority && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {task.description && (
                                            <p className={`text-sm mb-3 ${task.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                                                💡 {task.description}
                                            </p>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {/* Category Badge */}
                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium capitalize">
                                                {task.category || 'Wellness'}
                                            </span>
                                            
                                            {/* Auto-generated Badge */}
                                            {task.isAutoGenerated && (
                                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium flex items-center">
                                                    <Sparkles className="w-3 h-3 mr-1" /> AI Generated
                                                </span>
                                            )}
                                            
                                            {/* Time Remaining */}
                                            {task.expiresAt && (
                                                <span className={`px-3 py-1 rounded-full font-medium flex items-center ${
                                                    new Date(task.expiresAt) < new Date() 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    <Clock className="w-3 h-3 mr-1" /> {getTimeRemaining(task.expiresAt)}
                                                </span>
                                            )}
                                            
                                            {/* Assigned Date */}
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                                                📅 {getTaskTime(task)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {task.isCompleted && (
                                    <div className="mt-3 pt-3 border-t border-green-200">
                                        <p className="text-sm text-green-700 font-medium flex items-center">
                                            ✅ Completed! +2 points to your mental health score
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyTasksPage;