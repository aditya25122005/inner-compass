import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Journal = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      setMessage("You must be logged in to submit a journal entry.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/journal',
        { text: entry, mood, user: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.message);
      setEntry('');
      setMood('');
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 ease-in-out">
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542435503-9a3d60724831?q=80&w=1974&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>

        <div className="relative z-10 p-8">
          <h2 className="text-4xl font-extrabold text-center text-teal-400 mb-6 tracking-wide drop-shadow-md">
            Your Inner Sanctuary
          </h2>
          <p className="text-center text-gray-400 mb-8 max-w-xl mx-auto italic">
            "Your thoughts are your own. Write them down and let them go."
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                className="w-full p-4 border-2 border-gray-700 bg-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 text-gray-200 placeholder-gray-500 transition-all duration-300 ease-in-out shadow-inner"
                rows="8"
                placeholder="What's on your mind today?..."
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-300 font-medium text-lg">How are you feeling?</span>
              <div className="flex space-x-2">
                <MoodButton mood="happy" currentMood={mood} onClick={handleMoodSelect} label="😊" />
                <MoodButton mood="calm" currentMood={mood} onClick={handleMoodSelect} label="😌" />
                <MoodButton mood="sad" currentMood={mood} onClick={handleMoodSelect} label="😢" />
                <MoodButton mood="angry" currentMood={mood} onClick={handleMoodSelect} label="😡" />
                <MoodButton mood="anxious" currentMood={mood} onClick={handleMoodSelect} label="😥" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-purple-600 text-white rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500"
            >
              Save Your Thoughts
            </button>
          </form>

          {message && (
            <p className="mt-6 text-center text-sm font-semibold animate-pulse text-yellow-400">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MoodButton = ({ mood, currentMood, onClick, label }) => {
  const selectedStyle = {
    happy: 'bg-yellow-400 text-black',
    calm: 'bg-green-400 text-black',
    sad: 'bg-blue-400 text-white',
    angry: 'bg-red-400 text-white',
    anxious: 'bg-orange-400 text-black',
  };

  const defaultStyle = 'bg-gray-700 text-white';

  return (
    <button
      type="button"
      className={`p-4 rounded-full text-2xl transition-all duration-300 ease-in-out transform hover:scale-125 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
        mood === currentMood ? selectedStyle[mood] : defaultStyle
      }`}
      onClick={() => onClick(mood)}
      aria-label={mood}
    >
      {label}
    </button>
  );
};

export default Journal;