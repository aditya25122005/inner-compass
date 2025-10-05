import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; 


const API_URL = 'http://localhost:8000/api/journal';

const Journal = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      setMessage("You must be logged in to submit a journal entry.");
      return;
    }
    if (!entry.trim() || !mood) {
        setMessage("Please write an entry and select a mood."); 
        return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post(
        API_URL,
        { text: entry, mood, userId: user._id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setMessage("Journal entry saved successfully! 🎉");
      setEntry('');
      setMood('');


    } catch (error) {
      console.error("Journal Submission Error:", error); 
     
      const errorMessage = error.response?.data?.message || "An error occurred while saving. Please check your server."; // Save karte samay galti hui. Kripya apna server check karen.
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => setMessage(''), 5000);
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
            "Your thoughts are your own. Write them down and let them go." ("Aapke vichaar aapke hain. Unhein likho aur jaane do.")
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                className="w-full p-4 border-2 border-gray-700 bg-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 text-gray-200 placeholder-gray-500 transition-all duration-300 ease-in-out shadow-inner resize-none"
                rows="8"
                placeholder="What's on your mind today?..." 
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                required
                disabled={isSubmitting} 
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-300 font-medium text-lg">How are you feeling?</span> 
              <div className="flex space-x-2">
                <MoodButton mood="happy" currentMood={mood} onClick={handleMoodSelect} label="😊" disabled={isSubmitting} />
                <MoodButton mood="calm" currentMood={mood} onClick={handleMoodSelect} label="😌" disabled={isSubmitting} />
                <MoodButton mood="sad" currentMood={mood} onClick={handleMoodSelect} label="😢" disabled={isSubmitting} />
                <MoodButton mood="angry" currentMood={mood} onClick={handleMoodSelect} label="😡" disabled={isSubmitting} />
                <MoodButton mood="anxious" currentMood={mood} onClick={handleMoodSelect} label="😥" disabled={isSubmitting} />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-6 text-white rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500 flex items-center justify-center gap-2 
                ${isSubmitting || !entry.trim() || !mood
                  ? 'bg-gray-500 cursor-not-allowed opacity-70' 
                  : 'bg-purple-600 hover:scale-105 hover:bg-purple-700'
                }`}
              disabled={isSubmitting || !entry.trim() || !mood} // Disable if submitting or fields are empty (Submit karte samay ya field khaali hone par disable karen)
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Submitting... 
                </>
              ) : (
                'Save Your Thoughts' 
              )}
            </button>
          </form>

          {message && (
            <p className={`mt-6 text-center text-sm font-semibold animate-pulse ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MoodButton = ({ mood, currentMood, onClick, label, disabled }) => {
  // Define styles using Tailwind classes for better consistency (Behtar samanjasya ke liye Tailwind classes ka upyog karen)
  const selectedStyles = {
    happy: 'bg-yellow-400 ring-yellow-500 text-black shadow-lg shadow-yellow-500/50',
    calm: 'bg-green-400 ring-green-500 text-black shadow-lg shadow-green-500/50',
    sad: 'bg-blue-400 ring-blue-500 text-white shadow-lg shadow-blue-500/50',
    angry: 'bg-red-500 ring-red-500 text-white shadow-lg shadow-red-500/50',
    anxious: 'bg-orange-400 ring-orange-500 text-black shadow-lg shadow-orange-500/50',
  };

  const defaultStyle = 'bg-gray-700 text-white hover:bg-gray-600';

  return (
    <button
      type="button"
      className={`p-4 rounded-full text-2xl transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-70 
        ${mood === currentMood 
          ? selectedStyles[mood] + ' scale-125 ring-4' 
          : defaultStyle + ' hover:scale-110'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
      `}
      onClick={() => onClick(mood)}
      aria-label={mood}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Journal;
