import React, { useState } from 'react';
import { LucideCheckSquare, LucideSquare, LucideLightbulb, LucideTarget, LucideClock, LucideChevronRight } from 'lucide-react';

const DailyTasksCompact = ({ user }) => {
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

  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasksCount / tasks.length) * 100;

  const displayedTasks = showAllTasks ? tasks : tasks.slice(0, 2);
  const displayedSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 2);

  return (
    <div className="daily-tasks-compact">
      <div className="compact-header">
        <h3 className="compact-title">
          <LucideTarget size={18} className="title-icon" />
          Daily Tasks
        </h3>
        <div className="compact-progress">
          <span className="progress-text-compact">{completedTasksCount}/{tasks.length}</span>
          <div className="progress-bar-compact">
            <div 
              className="progress-fill-compact" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="compact-tasks-list">
        {displayedTasks.map((task) => (
          <div key={task.id} className={`compact-task-item ${task.completed ? 'completed' : ''}`}>
            <button
              onClick={() => toggleTaskCompletion(task.id)}
              className="compact-task-checkbox"
            >
              {task.completed ? <LucideCheckSquare size={16} /> : <LucideSquare size={16} />}
            </button>
            <div className="compact-task-content">
              <h4 className="compact-task-title">{task.title}</h4>
              <div className="compact-task-meta">
                <span className="compact-task-time">
                  <LucideClock size={10} />
                  {task.time}
                </span>
                <span className={`compact-task-type ${task.type}`}>{task.type}</span>
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length > 2 && (
          <button 
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="show-more-btn"
          >
            {showAllTasks ? 'Show Less' : `Show ${tasks.length - 2} More`}
            <LucideChevronRight size={14} className={`chevron ${showAllTasks ? 'rotated' : ''}`} />
          </button>
        )}
      </div>

      <div className="compact-suggestions">
        <h4 className="suggestions-title-compact">
          <LucideLightbulb size={16} />
          Suggestions
        </h4>
        <div className="compact-suggestions-list">
          {displayedSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="compact-suggestion-item">
              <div className="suggestion-icon-compact">{suggestion.icon}</div>
              <div className="compact-suggestion-content">
                <h5 className="compact-suggestion-title">{suggestion.title}</h5>
                <span className="compact-suggestion-category">{suggestion.category}</span>
              </div>
            </div>
          ))}
          
          {suggestions.length > 2 && (
            <button 
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
              className="show-more-btn small"
            >
              {showAllSuggestions ? 'Less' : `+${suggestions.length - 2} More`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTasksCompact;
