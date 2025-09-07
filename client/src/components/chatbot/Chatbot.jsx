import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Loader2, Bot, User, Settings, Trash2, BarChart3 } from 'lucide-react';
import chatbotAPI from '../../services/chatbotApi';
import ChatMessage from './ChatMessage';
import ChatStats from './ChatStats';
import MoodAnalyzer from './MoodAnalyzer';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showMoodAnalyzer, setShowMoodAnalyzer] = useState(false);
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

    try {
      const result = await chatbotAPI.sendMessage(userMessage);
      
      if (result.success) {
        // Add both user and bot messages to the state
        setMessages(prev => [
          ...prev,
          result.data.userMessage,
          result.data.botMessage
        ]);
      } else {
        setError(result.error);
        // Add user message anyway
        setMessages(prev => [
          ...prev,
          {
            message: userMessage,
            sender: 'user',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      setError('Failed to send message');
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

  if (showStats) {
    return <ChatStats onBack={() => setShowStats(false)} />;
  }

  if (showMoodAnalyzer) {
    return <MoodAnalyzer onBack={() => setShowMoodAnalyzer(false)} />;
  }

  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">InnerCompass AI</h1>
              <p className="text-sm text-gray-500">Your compassionate AI companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMoodAnalyzer(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Mood Analyzer"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Chat Statistics"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            <button
              onClick={clearHistory}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 m-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-500">Loading your conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to InnerCompass AI</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              I'm here to support your emotional well-being. Start a conversation by sharing how you're feeling today.
            </p>
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
            <div className="bg-white rounded-lg shadow-sm p-4 max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts or feelings..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
