import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, Home, Calendar, Frown, Smile, Laugh, Meh, Angry } from 'lucide-react'; 


const API_URL = 'https://inner-compass-seven.vercel.app/api/journal';

const Journal = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pastEntries, setPastEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  }); 

  useEffect(() => {
    // Update current date and time every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (token) {
      fetchPastEntries();
    }
  }, [token]);

  // Add keyboard shortcuts for formatting
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if contentEditable is focused
      if (document.activeElement !== editorRef.current) return;

      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            applyFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormatting('italic');
            break;
          case 'u':
            e.preventDefault();
            applyFormatting('underline');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchPastEntries = async () => {
    setIsLoadingEntries(true);
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Get last 5 entries
      setPastEntries(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching past entries:', error);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const applyFormatting = (format) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    
    // Use execCommand for rich text formatting
    switch(format) {
      case 'bold':
        document.execCommand('bold', false, null);
        setActiveFormats(prev => ({ ...prev, bold: !prev.bold }));
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        setActiveFormats(prev => ({ ...prev, italic: !prev.italic }));
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        setActiveFormats(prev => ({ ...prev, underline: !prev.underline }));
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false, null);
        setActiveFormats(prev => ({ ...prev, strikethrough: !prev.strikethrough }));
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      default:
        break;
    }
  };

  const handleEditorInput = (e) => {
    const text = e.currentTarget.textContent || '';
    setEntry(text.trim());
  };

  const handleEditorPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
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
      
      // Clear editor
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      setEntry('');
      setMood('');
      
      // Refresh past entries
      fetchPastEntries();

    } catch (error) {
      console.error("Journal Submission Error:", error); 
     
      const errorMessage = error.response?.data?.message || "An error occurred while saving. Please check your server.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      {/* Top Navbar */}
      <nav className="bg-purple-50 border-b-2 border-purple-200">
        <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-600" style={{
            fontFamily: "'Georgia', serif",
            letterSpacing: '-0.01em'
          }}>
            Inner Compass
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-5 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors duration-200 font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-[1400px] flex space-x-6 justify-center">
        {/* Left Sidebar - Past Entries */}
        <div className="w-[480px] bg-gradient-to-b from-[#E8D5F2] via-[#E0CCEC] to-[#D4C5E8] rounded-3xl p-8 relative" style={{
          maxHeight: 'calc(100vh - 180px)',
          border: '8px solid rgba(230, 220, 240, 1)',
          outline: '3px solid rgba(150, 120, 180, 0.8)',
          outlineOffset: '-11px',
          boxShadow: '0 2px 8px rgba(150, 120, 180, 0.15)',
          fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }}>
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400 opacity-40 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-purple-400 opacity-40 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-400 opacity-40 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-purple-400 opacity-40 rounded-br-lg"></div>
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-gray-800" style={{ 
              fontFamily: "'Playfair Display', 'Georgia', serif",
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>Past Entries</h2>
          </div>

          {isLoadingEntries ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
            </div>
          ) : pastEntries.length === 0 ? (
            <p className="text-gray-500 text-center italic py-8">No past entries yet</p>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {pastEntries.map((pastEntry) => (
                <div 
                  key={pastEntry._id}
                  onClick={() => setSelectedEntry(pastEntry)}
                  className="bg-gradient-to-br from-[#F8F0FF] to-[#F0E6FF] rounded-2xl p-5 hover:opacity-90 transition-all duration-200 cursor-pointer relative"
                  style={{
                    border: '3px solid rgba(210, 195, 230, 1)',
                    boxShadow: '0 1px 4px rgba(150, 120, 180, 0.1)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  <p className="text-gray-900 font-normal line-clamp-2 mb-3 leading-relaxed text-base">
                    {pastEntry.text}
                  </p>
                  <p className="text-sm text-gray-700 font-normal">
                    {formatDate(pastEntry.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Current Entry */}
        <div className="flex-1 bg-gradient-to-b from-[#FFF8F0] via-[#FFEAD8] to-[#FFE0CC] rounded-3xl p-10 relative" style={{
          border: '8px solid rgba(255, 235, 215, 1)',
          outline: '3px solid rgba(220, 150, 120, 0.8)',
          outlineOffset: '-11px',
          boxShadow: '0 2px 8px rgba(220, 150, 120, 0.15)',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          maxWidth: '700px'
        }}>
          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-orange-300 opacity-40 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-orange-300 opacity-40 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-300 opacity-40 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-300 opacity-40 rounded-br-lg"></div>
          {/* Date on Left and Mood Selector on Right */}
          <div className="flex items-center justify-between mb-8">
            {/* Date Display - Left */}
            <div className="flex items-center space-x-3">
              <Calendar className="w-7 h-7 text-orange-600" />
              <span className="text-3xl font-semibold text-gray-800" style={{ 
                fontFamily: "'Playfair Display', 'Georgia', serif",
                letterSpacing: '-0.02em'
              }}>
                {formatDate(currentDate)}
              </span>
            </div>

            {/* Mood Selector - Right */}
            <div className="flex space-x-3">
              <MoodButton mood="sad" currentMood={mood} onClick={handleMoodSelect} icon={Frown} disabled={isSubmitting} color="#FFD700" />
              <MoodButton mood="calm" currentMood={mood} onClick={handleMoodSelect} icon={Smile} disabled={isSubmitting} color="#FFA500" />
              <MoodButton mood="happy" currentMood={mood} onClick={handleMoodSelect} icon={Laugh} disabled={isSubmitting} color="#FF69B4" />
              <MoodButton mood="anxious" currentMood={mood} onClick={handleMoodSelect} icon={Meh} disabled={isSubmitting} color="#9370DB" />
              <MoodButton mood="angry" currentMood={mood} onClick={handleMoodSelect} icon={Angry} disabled={isSubmitting} color="#8A7EC7" />
            </div>
          </div>

          {/* Text Area */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div
              ref={editorRef}
              contentEditable={!isSubmitting}
              onInput={handleEditorInput}
              onPaste={handleEditorPaste}
              className="w-full p-6 bg-white/50 focus:outline-none text-gray-800 overflow-y-auto text-base leading-relaxed"
              style={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                minHeight: '380px',
                maxHeight: '380px',
                width: '100%',
                border: '4px solid rgba(255, 230, 210, 1)',
                outline: '2px solid rgba(220, 150, 120, 0.6)',
                outlineOffset: '-6px',
                borderRadius: '12px',
                letterSpacing: '0.01em',
                lineHeight: '1.8',
                boxShadow: '0 1px 4px rgba(220, 150, 120, 0.1)'
              }}
              data-placeholder="Write your thoughts here..."
            ></div>

            {/* Formatting Toolbar */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-2">
                <button 
                  type="button" 
                  onClick={() => applyFormatting('bold')}
                  className={`p-2.5 rounded-lg transition-all duration-200 font-bold text-base ${
                    activeFormats.bold 
                      ? 'bg-orange-200 text-orange-800' 
                      : 'hover:bg-white/40 text-gray-700'
                  }`}
                  title="Bold (Ctrl+B)"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  B
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormatting('italic')}
                  className={`p-2.5 rounded-lg transition-all duration-200 italic text-base ${
                    activeFormats.italic 
                      ? 'bg-orange-200 text-orange-800' 
                      : 'hover:bg-white/40 text-gray-700'
                  }`}
                  title="Italic (Ctrl+I)"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  I
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormatting('underline')}
                  className={`p-2.5 rounded-lg transition-all duration-200 underline text-base ${
                    activeFormats.underline 
                      ? 'bg-orange-200 text-orange-800' 
                      : 'hover:bg-white/40 text-gray-700'
                  }`}
                  title="Underline (Ctrl+U)"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  U
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormatting('strikethrough')}
                  className={`p-2.5 rounded-lg transition-all duration-200 line-through text-base ${
                    activeFormats.strikethrough 
                      ? 'bg-orange-200 text-orange-800' 
                      : 'hover:bg-white/40 text-gray-700'
                  }`}
                  title="Strikethrough"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  S
                </button>
                <button 
                  type="button" 
                  onClick={() => applyFormatting('link')}
                  className="p-2.5 hover:bg-white/40 rounded-lg transition-all duration-200 text-gray-700 text-base"
                  title="Insert Link"
                >
                  🔗
                </button>
              </div>

              <button
                type="submit"
                className={`px-10 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 text-lg ${
                  isSubmitting || !entry.trim() || !mood
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-[#FF9A76] to-[#FF6B9D] hover:from-[#FF8A66] hover:to-[#FF5B8D] hover:shadow-xl hover:scale-105'
                }`}
                disabled={isSubmitting || !entry.trim() || !mood}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>

          {message && (
            <p className={`mt-4 text-center text-base font-semibold ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}
        </div>
        </div>
      </div>

      {/* Modal for viewing full entry */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedEntry(null)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '6px solid rgba(230, 220, 240, 1)',
              outline: '3px solid rgba(150, 120, 180, 0.8)',
              outlineOffset: '-9px',
              boxShadow: '0 4px 16px rgba(150, 120, 180, 0.2)'
            }}
          >
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-600 font-bold text-xl">×</span>
            </button>
            <div className="mb-4">
              <p className="text-sm text-gray-500 font-medium">
                {formatDate(selectedEntry.createdAt)}
              </p>
            </div>
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
              {selectedEntry.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MoodButton = ({ mood, currentMood, onClick, icon: Icon, disabled, color }) => {
  const isSelected = mood === currentMood;

  return (
    <button
      type="button"
      onClick={() => onClick(mood)}
      disabled={disabled}
      className={`p-3 rounded-full transition-all duration-200 hover:opacity-80 ${
        isSelected ? 'scale-110' : ''
      }`}
      style={{
        backgroundColor: color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        border: isSelected ? '3px solid rgba(0, 0, 0, 0.2)' : 'none'
      }}
      aria-label={mood}
    >
      <Icon className="w-6 h-6 text-white" style={{
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
      }} />
    </button>
  );
};

export default Journal;
