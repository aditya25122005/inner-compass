import React, { useState } from 'react';
import { LucideCheckSquare, LucideSquare, LucideLightbulb, LucideTarget, LucideClock } from 'lucide-react';

const DailyTasks = ({ user }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness',
      completed: true,
      type: 'wellness',
      time: '07:00'
    },
    {
      id: 2,
      title: 'Mood Check-in',
      description: 'Rate your current mood',
      completed: true,
      type: 'tracking',
      time: '12:00'
    },
    {
      id: 3,
      title: 'Evening Reflection',
      description: 'Journal about your day',
      completed: false,
      type: 'wellness',
      time: '20:00'
    },
    {
      id: 4,
      title: 'Gratitude Practice',
      description: 'Write 3 things you\'re grateful for',
      completed: false,
      type: 'mental',
      time: '21:00'
    }
  ]);

  const [suggestions] = useState([
    {
      id: 1,
      title: 'Try Deep Breathing',
      description: 'Take 5 deep breaths when feeling stressed',
      category: 'Stress Relief',
      icon: '🫁'
    },
    {
      id: 2,
      title: 'Take a Nature Walk',
      description: '15-minute walk outdoors can boost mood',
      category: 'Physical Wellness',
      icon: '🚶'
    },
    {
      id: 3,
      title: 'Practice Gratitude',
      description: 'Focus on positive aspects of your day',
      category: 'Mental Health',
      icon: '🙏'
    }
  ]);

  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasksCount / tasks.length) * 100;

  return (
    <div className="card daily-tasks-card">
      <div className="card-header">
        <h2 className="card-title">
          <LucideTarget size={20} className="card-icon" />
          Daily Tasks
        </h2>
        <div className="tasks-progress">
          <span className="progress-text">{completedTasksCount}/{tasks.length} completed</span>
          <div className="task-progress-bar">
            <div 
              className="task-progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className="task-checkbox"
            >
              {task.completed ? <LucideCheckSquare size={20} /> : <LucideSquare size={20} />}
            </button>
            <div className="task-content">
              <h4 className="task-title">{task.title}</h4>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className="task-time">
                  <LucideClock size={12} />
                  {task.time}
                </span>
                <span className={`task-type ${task.type}`}>{task.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="suggestions-section">
        <h3 className="suggestions-title">
          <LucideLightbulb size={18} />
          Today's Suggestions
        </h3>
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="suggestion-item">
              <div className="suggestion-icon">{suggestion.icon}</div>
              <div className="suggestion-content">
                <h4 className="suggestion-title">{suggestion.title}</h4>
                <p className="suggestion-description">{suggestion.description}</p>
                <span className="suggestion-category">{suggestion.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
