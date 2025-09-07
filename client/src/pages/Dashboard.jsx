import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, BarChart3, BookOpen, LogOut, Home, Search, HeartPulse } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="text-center p-8">You are not logged in.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">InnerCompass Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Wellness Journey</h2>
          <p className="text-gray-600">
            Take control of your mental well-being with our AI-powered tools and personalized insights.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Chatbot Card */}
          <Link
            to="/chatbot"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI Companion</h3>
                <p className="text-sm text-gray-500">Chat with InnerCompass AI</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Get emotional support, mood analysis, and personalized wellness guidance from our AI companion.
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <span>Start Conversation</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Mood Tracking Card - Placeholder */}
          <Link
            to="/dashboard"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 opacity-75 cursor-not-allowed"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Mood Tracking</h3>
                <p className="text-sm text-gray-500">Coming Soon</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Track your daily emotions and discover patterns in your mental wellness journey.
            </p>
            <div className="flex items-center text-gray-400 text-sm font-medium">
              <span>Feature in Development</span>
            </div>
          </Link>

          {/* Digital Journal Card */}
          <Link
            to="/journal"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Digital Journal</h3>
                <p className="text-sm text-gray-500">Write, reflect, and grow</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Write, reflect, and grow with guided journal prompts and personal insights.
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <span>Start Your Journal</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Resources Card - New Link Added */}
          <Link
            to="/resources"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg group-hover:scale-105 transition-transform">
                <HeartPulse className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Nearby Doctors</h3>
                <p className="text-sm text-gray-500">Find local mental health support</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Find and connect with nearby mental health professionals and support groups.
            </p>
            <div className="flex items-center text-yellow-600 text-sm font-medium">
              <span>Find Resources</span>
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/chatbot"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start AI Chat
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Log Mood (Coming Soon)
            </Link>
            <Link
              to="/journal"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Write Journal
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Find Resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
