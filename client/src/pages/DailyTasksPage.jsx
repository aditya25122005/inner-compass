// src/pages/DailyTasksPage.jsx
import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Clock,
  Trash2,
  Target,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { taskAPI } from "../services/api";

const badgeClassMap = {
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-100 text-gray-700",
};

const DailyTasksPage = () => {
  const [aiTasks, setAiTasks] = useState([]);
  const [routineTasks, setRoutineTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskAPI.getSeparatedTasks();
      setAiTasks(res.aiTasks || []);
      setRoutineTasks(res.routineTasks || []);
      setRefreshToggle((s) => !s);
    } catch (err) {
      console.error("Failed to load tasks", err);
      setError(
        "Failed to fetch tasks. Make sure backend is running & you are logged in."
      );
      setAiTasks([]);
      setRoutineTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId, currentState, isAi) => {
    const setter = isAi ? setAiTasks : setRoutineTasks;
    const list = isAi ? aiTasks : routineTasks;
    const prev = [...list];
    setter(
      list.map((t) =>
        t._id === taskId ? { ...t, isCompleted: !currentState } : t
      )
    );

    try {
      await taskAPI.updateTaskStatus(taskId, !currentState);
    } catch (err) {
      setter(prev);
      console.error("Failed to update task:", err);
      alert("Failed to update task status. Please try again.");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    const prevAi = [...aiTasks];
    const prevRoutine = [...routineTasks];
    setAiTasks(aiTasks.filter((t) => t._id !== taskId));
    setRoutineTasks(routineTasks.filter((t) => t._id !== taskId));

    try {
      await taskAPI.deleteTask(taskId);
    } catch (err) {
      setAiTasks(prevAi);
      setRoutineTasks(prevRoutine);
      console.error("Failed to delete task:", err);
      alert("Failed to delete task. Try again.");
    }
  };

  const filterTasks = (tasks) => {
    if (filter === "completed") return tasks.filter((t) => t.isCompleted);
    if (filter === "pending") return tasks.filter((t) => !t.isCompleted);
    return tasks;
  };

  const getTaskTime = (task) =>
    task.assignedDate
      ? new Date(task.assignedDate).toLocaleDateString()
      : "Today";

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg shadow">
            {error}
            <div className="mt-4">
              <button
                onClick={fetchTasks}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Daily Task Manager
          </h1>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3">
            {["pending", "completed", "all"].map((b) => (
              <button
                key={b}
                onClick={() => setFilter(b)}
                className={`px-4 py-2 rounded-full font-medium capitalize transition-all transform ${
                  filter === b
                    ? "bg-indigo-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border hover:bg-gray-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            AI Tasks: <span className="font-semibold">{aiTasks.length}</span>{" "}
            &nbsp; • &nbsp; Routine:{" "}
            <span className="font-semibold">{routineTasks.length}</span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="card animate-slide-up text-center py-20 border border-gray-200">
            <Loader2 className="w-10 h-10 mx-auto text-indigo-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600">
              Fetching your personalized tasks...
            </p>
          </div>
        ) : (
          <>
            {/* Routine */}
            <SectionTitle emoji="📌" title="Routine Daily Tasks" />

            {filterTasks(routineTasks).length === 0 ? (
              <EmptyMessage text="No routine tasks match this filter." />
            ) : (
              <div className="space-y-3 mb-8">
                {filterTasks(routineTasks).map((task, idx) => (
                  <AnimatedTaskCard
                    key={task._id}
                    task={task}
                    index={idx}
                    onToggle={() =>
                      toggleTaskCompletion(task._id, task.isCompleted, false)
                    }
                    onDelete={() => handleDelete(task._id)}
                    getTaskTime={getTaskTime}
                    badge="blue"
                  />
                ))}
              </div>
            )}

            {/* AI Tasks */}
            <SectionTitle emoji="🤖" title="AI Suggested Tasks" className="mt-6" />

            {filterTasks(aiTasks).length === 0 ? (
              <EmptyMessage text="No AI tasks yet. Write a journal entry!" />
            ) : (
              <div className="space-y-3 mb-8">
                {filterTasks(aiTasks).map((task, idx) => (
                  <AnimatedTaskCard
                    key={task._id}
                    task={task}
                    index={idx}
                    onToggle={() =>
                      toggleTaskCompletion(task._id, task.isCompleted, true)
                    }
                    onDelete={() => handleDelete(task._id)}
                    getTaskTime={getTaskTime}
                    badge="purple"
                    showAIBadge
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DailyTasksPage;

/* ----------------- Subcomponents ------------------ */

const SectionTitle = ({ emoji, title, className = "" }) => (
  <h2
    className={`text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2 ${className}`}
  >
    <span className="text-2xl">{emoji}</span>
    <span>{title}</span>
  </h2>
);

const EmptyMessage = ({ text }) => (
  <div className="bg-white border rounded-lg p-5 text-center text-sm text-gray-500">
    {text}
  </div>
);

const AnimatedTaskCard = ({
  task,
  index,
  onToggle,
  onDelete,
  getTaskTime,
  badge,
  showAIBadge,
}) => {
  const entranceDelay = `${index * 60}ms`;
  const badgeClasses = badgeClassMap[badge] || badgeClassMap.gray;

  return (
    <div
      style={{
        transitionDelay: entranceDelay,
      }}
      className={`transform transition-all duration-500 ease-out opacity-0 translate-y-4 group hover:translate-y-0 hover:scale-[1.01]`}
      ref={(el) => {
        if (!el) return;
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";
        }, 20 + index * 60);
      }}
    >
      <div
        className={`flex items-center p-4 rounded-xl shadow-md border mb-3 transition-shadow duration-300 ${
          task.isCompleted
            ? "bg-green-50 border-green-300"
            : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={onToggle}
          className={`p-2 rounded-full mr-4 transition-colors ${
            task.isCompleted
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 hover:bg-indigo-400"
          }`}
        >
          <CheckSquare className="w-6 h-6 text-white" />
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-lg font-semibold ${
              task.isCompleted
                ? "line-through text-gray-500"
                : "text-gray-800"
            }`}
          >
            {task.title}
          </p>

          <div className="flex items-center space-x-3 text-sm mt-1 text-gray-500">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${badgeClasses}`}
            >
              {task.category}
            </span>

            {showAIBadge && (
              <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">
                AI
              </span>
            )}

            <span className="flex items-center text-xs">
              <Clock className="w-3 h-3 mr-1" /> {getTaskTime(task)}
            </span>
          </div>
        </div>

        <button
          onClick={onDelete}
          className="p-2 ml-4 text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
