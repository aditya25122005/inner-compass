import React, { useState, useEffect } from 'react';
import { journalAPI } from '../../services/api';

const JournalCard = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [newMood, setNewMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await journalAPI.getAllEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.trim() || !newMood) return;

    setIsLoading(true);
    try {
      await journalAPI.createEntry(newEntry, newMood);
      setNewEntry('');
      setNewMood('');
      await loadEntries(); // Refresh entries
    } catch (error) {
      console.error('Failed to create entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'text-green-400' },
    { value: 'sad', label: '😢 Sad', color: 'text-blue-400' },
    { value: 'anxious', label: '😰 Anxious', color: 'text-yellow-400' },
    { value: 'calm', label: '😌 Calm', color: 'text-indigo-400' },
    { value: 'angry', label: '😠 Angry', color: 'text-red-400' },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full h-80 transition-transform duration-300 hover:scale-105 overflow-hidden">
      <h2 className="text-xl font-bold text-gray-300 mb-4">Journal Entries</h2>
      
      <div className="h-full flex flex-col">
        {/* Add new entry form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex flex-col space-y-3">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="How are you feeling today?"
              className="form-input resize-none h-16 text-sm"
              disabled={isLoading}
            />
            <div className="flex space-x-2">
              <select
                value={newMood}
                onChange={(e) => setNewMood(e.target.value)}
                className="form-input text-sm p-2 flex-1"
                disabled={isLoading}
              >
                <option value="">Select mood...</option>
                {moodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isLoading || !newEntry.trim() || !newMood}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <div className="loading-spinner w-4 h-4"></div> : 'Add'}
              </button>
            </div>
          </div>
        </form>

        {/* Entries list */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading && entries.length === 0 ? (
            <div className="text-center py-4">
              <div className="loading-spinner mx-auto mb-2"></div>
              <div className="text-gray-400 text-sm">Loading entries...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>📝 No entries yet.</p>
              <p>Add your first journal entry!</p>
            </div>
          ) : (
            entries.slice(0, 3).map((entry, index) => {
              const mood = moodOptions.find(m => m.value === entry.mood);
              const moodClass = `mood-${entry.mood}`;
              return (
                <div key={entry._id} className="interactive bg-gray-700 p-3 rounded-lg text-sm border border-gray-600 hover:border-gray-500" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`mood-indicator ${moodClass}`}>
                      {mood?.label || entry.mood}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-200 text-xs leading-relaxed">
                    {entry.content.length > 80 ? `${entry.content.substring(0, 80)}...` : entry.content}
                  </p>
                </div>
              );
            })
          )}
          {entries.length > 3 && (
            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">+{entries.length - 3} more entries</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalCard;
