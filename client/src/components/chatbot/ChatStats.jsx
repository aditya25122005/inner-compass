import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, MessageCircle, Users, Calendar, TrendingUp } from 'lucide-react';
import chatbotAPI from '../../services/chatbotApi';

const ChatStats = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await chatbotAPI.getStats();
      if (result.success) {
        setStats(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysSinceFirst = () => {
    if (!stats?.firstMessageDate) return 0;
    const firstDate = new Date(stats.firstMessageDate);
    const now = new Date();
    const diffTime = Math.abs(now - firstDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">Chat Statistics</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">Chat Statistics</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
              <p>{error}</p>
              <button 
                onClick={fetchStats} 
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Chat Statistics</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalMessages || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Your Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.userMessages || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">AI Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.botMessages || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.recentMessages || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">First Chat</span>
                  <span className="text-sm text-gray-800">{formatDate(stats?.firstMessageDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Last Chat</span>
                  <span className="text-sm text-gray-800">{formatDate(stats?.lastMessageDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Days Active</span>
                  <span className="text-sm text-gray-800">{getDaysSinceFirst()} days</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Avg Messages/Day</span>
                  <span className="text-sm text-gray-800">
                    {stats?.averageMessagesPerDay ? stats.averageMessagesPerDay.toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Usage Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Usage Insights
              </h3>
              <div className="space-y-4">
                {stats?.totalMessages > 0 ? (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Great progress!</strong> You've had {stats.totalMessages} conversations with InnerCompass AI.
                      </p>
                    </div>
                    
                    {stats.recentMessages > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Staying active!</strong> You've chatted {stats.recentMessages} times in the last 7 days.
                        </p>
                      </div>
                    )}
                    
                    {stats.averageMessagesPerDay > 1 && (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-800">
                          <strong>Consistent engagement!</strong> You average {stats.averageMessagesPerDay.toFixed(1)} messages per day.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">
                      Start your first conversation to see your insights here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {stats?.totalMessages > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation Balance</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Your messages</span>
                  <span>{stats.userMessages}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    style={{
                      width: `${(stats.userMessages / stats.totalMessages) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>AI responses</span>
                  <span>{stats.botMessages}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(stats.botMessages / stats.totalMessages) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatStats;
