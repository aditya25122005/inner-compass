import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatbotAPI from '../../services/chatbotApi';
import ChatMessage from './ChatMessage';
import bgImage from '../../assests/bg-img1.png';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const result = await chatbotAPI.getChatHistory();
      if (result.success) {
        setMessages(result.data.messages || []);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Optimistically add user message
    const tempUserMessage = {
      _id: 'temp-' + Date.now(),
      message: userMessage,
      sender: 'user',
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const result = await chatbotAPI.sendMessage(userMessage);
      
      if (result.success) {
        // Replace temp message with actual messages from server
        setMessages(prev => [
          ...prev.filter(m => m._id !== tempUserMessage._id),
          result.data.userMessage,
          result.data.botMessage
        ]);
      } else {
        setError(result.error || 'Failed to get response. Please try again.');
        console.error('Chatbot API error:', result.error);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Unable to connect to the chatbot service. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await chatbotAPI.clearChatHistory();
      if (result.success) {
        setMessages([]);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to clear chat history');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 50%, #B0BEC5 100%)'
      }}
    >
      {/* Main Container with thick border */}
      <div 
        className="w-full max-w-7xl h-[85vh] bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col relative"
        style={{
          border: '8px solid rgba(230, 220, 240, 1)',
          outline: '3px solid rgba(150, 120, 180, 0.9)',
          outlineOffset: '-11px',
          boxShadow: '0 8px 32px rgba(150, 120, 180, 0.3)'
        }}
      >
        {/* Header with Back Button */}
        <div className="bg-purple-50 border-b-2 border-purple-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-6 w-6 text-purple-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-purple-600" style={{
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                  letterSpacing: '-0.02em',
                  fontWeight: '700'
                }}>
                  InnerCompass AI
                </h1>
                <p className="text-sm text-gray-600 font-medium" style={{
                  fontFamily: "'Inter', sans-serif"
                }}>Your compassionate AI companion</p>
              </div>
            </div>
            
            <button
              onClick={clearHistory}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-sm underline ml-4"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4 relative"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'local'
          }}
        >
          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
          
          <div className="relative z-10">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center bg-white/90 rounded-2xl p-8 shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Loading your conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                <Bot className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{
                  fontFamily: "'Poppins', sans-serif"
                }}>Welcome to InnerCompass AI</h3>
                <p className="text-gray-700 font-medium" style={{
                  fontFamily: "'Inter', sans-serif"
                }}>
                  I'm here to support your emotional well-being. Start a conversation by sharing how you're feeling today.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage 
                key={message._id || index} 
                message={message} 
              />
            ))
          )}
        
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/95 rounded-lg shadow-lg p-4 max-w-xs border-2 border-purple-300">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-purple-50 border-t-2 border-purple-200 p-6 rounded-b-2xl">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts or feelings..."
                className="w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows="1"
                disabled={isLoading}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          
          <p className="text-xs text-gray-600 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
