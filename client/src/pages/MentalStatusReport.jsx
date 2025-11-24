import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, MessageCircle, BookOpen, TrendingUp, User, Heart, AlertTriangle, Zap, Shield, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import chatbotAPI from '../services/chatbotApi';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts';

const MentalStatusReport = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    chatStats: null,
    journalStats: null,
    moodAnalytics: null,
    overallScore: 0
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch chat statistics
      const chatResult = await chatbotAPI.getStats();
      
      // Fetch journal entries
      const journalResponse = await axios.get('http://localhost:5000/api/journal', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch user profile to get actual mental health score
      const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Use the actual mental health score from user profile
      const overallScore = profileResponse.data.data.mentalHealthScore || 50;

      // Process mood analytics from journals
      const journals = journalResponse.data || [];
      const moodCounts = journals.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});
      
      // Emotional stability score (variance in moods)
      const moodScores = journals.slice(0, 30).map(j => getMoodScore(j.mood));
      const avgScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length || 50;
      const variance = moodScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / moodScores.length;
      const emotionalStability = Math.max(0, 100 - Math.sqrt(variance));
      
      // Risk assessment based on negative moods
      const negativeCount = (moodCounts['sad'] || 0) + (moodCounts['anxious'] || 0) + (moodCounts['angry'] || 0);
      const totalCount = journals.length;
      const riskLevel = totalCount > 0 ? (negativeCount / totalCount) * 100 : 0;

      // Get recent mood trend
      const recentJournals = journals.slice(0, 10).reverse();
      const moodTrend = recentJournals.map((entry, idx) => ({
        day: `Day ${idx + 1}`,
        mood: entry.mood,
        moodScore: getMoodScore(entry.mood),
        date: new Date(entry.createdAt).toLocaleDateString()
      }));

      const avgMoodScore = moodTrend.length > 0 
        ? moodTrend.reduce((sum, item) => sum + item.moodScore, 0) / moodTrend.length 
        : 50;
      const chatEngagement = chatResult.success ? Math.min((chatResult.data.totalMessages / 50) * 100, 100) : 0;
      const journalConsistency = Math.min((journals.length / 20) * 100, 100);
      
      // Psychological wellness dimensions
      const wellnessDimensions = [
        { dimension: 'Emotional', score: Math.round(avgMoodScore), fullMark: 100 },
        { dimension: 'Social', score: Math.round(chatEngagement), fullMark: 100 },
        { dimension: 'Cognitive', score: Math.round(journalConsistency), fullMark: 100 },
        { dimension: 'Stability', score: Math.round(emotionalStability), fullMark: 100 },
        { dimension: 'Resilience', score: Math.round(100 - riskLevel), fullMark: 100 }
      ];
      
      // Mood volatility over time
      const moodVolatility = moodTrend.map((item, idx) => ({
        day: item.day,
        score: item.moodScore,
        change: idx > 0 ? item.moodScore - moodTrend[idx - 1].moodScore : 0
      }));

      setReportData({
        chatStats: chatResult.success ? chatResult.data : null,
        journalStats: {
          totalEntries: journals.length,
          recentEntries: journals.slice(0, 5),
          moodDistribution: Object.entries(moodCounts).map(([mood, count]) => ({
            mood,
            count,
            color: getMoodColor(mood)
          })),
          moodTrend
        },
        moodAnalytics: {
          dominant: Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, 'calm'),
          avgScore: avgMoodScore,
          emotionalStability: Math.round(emotionalStability),
          riskLevel: Math.round(riskLevel)
        },
        wellnessDimensions,
        moodVolatility,
        overallScore
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodScore = (mood) => {
    const scores = { happy: 90, calm: 75, sad: 40, anxious: 35, angry: 30 };
    return scores[mood] || 50;
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#10B981',
      calm: '#3B82F6',
      sad: '#6366F1',
      anxious: '#F59E0B',
      angry: '#EF4444'
    };
    return colors[mood] || '#6B7280';
  };

  const getStatusLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-100' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { label: 'Needs Attention', color: 'text-red-500', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your mental health report...</p>
        </div>
      </div>
    );
  }

  const status = getStatusLabel(reportData.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-800">Mental Status Report</h1>
            </div>
            <div className={`px-4 py-2 rounded-full ${status.bg}`}>
              <span className={`font-semibold ${status.color}`}>{status.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-4 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Overall Mental Health Score</h3>
            <div className="relative w-48 h-48 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="20" />
                <circle 
                  cx="100" cy="100" r="90" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="20" 
                  strokeDasharray={`${(reportData.overallScore / 100) * 565} 565`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold">{reportData.overallScore}</span>
                <span className="text-lg">out of 100</span>
              </div>
            </div>
            <p className="text-white/90">
              Based on your chat engagement, journal consistency, and mood patterns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chat Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">AI Chat Analytics</h3>
            </div>
            
            {reportData.chatStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Conversations</p>
                    <p className="text-3xl font-bold text-blue-600">{reportData.chatStats.totalMessages}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Your Messages</p>
                    <p className="text-3xl font-bold text-green-600">{reportData.chatStats.userMessages}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">AI Responses</p>
                    <p className="text-3xl font-bold text-purple-600">{reportData.chatStats.botMessages}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Recent (7 days)</p>
                    <p className="text-3xl font-bold text-orange-600">{reportData.chatStats.recentMessages}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Daily Average</span>
                    <span className="font-semibold">{reportData.chatStats.averageMessagesPerDay?.toFixed(1) || '0.0'} messages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Activity</span>
                    <span className="font-semibold">
                      {reportData.chatStats.lastMessageDate 
                        ? new Date(reportData.chatStats.lastMessageDate).toLocaleDateString() 
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No chat data available</p>
            )}
          </div>

          {/* Journal Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Journal History</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                <p className="text-3xl font-bold text-purple-600">{reportData.journalStats.totalEntries}</p>
              </div>
              
              {reportData.journalStats.totalEntries > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Recent Entries:</h4>
                  {reportData.journalStats.recentEntries.map((entry, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${getMoodColor(entry.mood)}/10`}>
                          {entry.mood}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{entry.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mental Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-green-600">{reportData.moodAnalytics?.emotionalStability || 0}</span>
            </div>
            <h4 className="font-semibold text-gray-800">Emotional Stability</h4>
            <p className="text-sm text-gray-600 mt-1">Consistency in mood patterns</p>
          </div>
          
          <div className={`rounded-xl shadow-lg p-6 border-2 ${
            reportData.moodAnalytics?.riskLevel < 30 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' :
            reportData.moodAnalytics?.riskLevel < 60 ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' :
            'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className={`h-8 w-8 ${
                reportData.moodAnalytics?.riskLevel < 30 ? 'text-green-600' :
                reportData.moodAnalytics?.riskLevel < 60 ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <span className={`text-3xl font-bold ${
                reportData.moodAnalytics?.riskLevel < 30 ? 'text-green-600' :
                reportData.moodAnalytics?.riskLevel < 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>{reportData.moodAnalytics?.riskLevel || 0}%</span>
            </div>
            <h4 className="font-semibold text-gray-800">Risk Assessment</h4>
            <p className="text-sm text-gray-600 mt-1">Negative mood indicators</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <Smile className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600 capitalize">{reportData.moodAnalytics?.dominant || 'N/A'}</span>
            </div>
            <h4 className="font-semibold text-gray-800">Dominant Mood</h4>
            <p className="text-sm text-gray-600 mt-1">Most frequent emotional state</p>
          </div>
        </div>

        {/* Psychological Wellness Dimensions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <Brain className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Psychological Wellness Dimensions</h3>
          </div>
          
          {reportData.wellnessDimensions && reportData.wellnessDimensions.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={reportData.wellnessDimensions}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" style={{ fontSize: '13px', fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: '11px' }} />
                <Radar name="Wellness Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">Not enough data for wellness analysis</p>
          )}
        </div>

        {/* Mood Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <Zap className="h-6 w-6 text-yellow-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Emotional Pattern Distribution</h3>
            </div>
            {reportData.journalStats.moodDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.journalStats.moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ mood, count }) => `${mood}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {reportData.journalStats.moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-16">No mood data available</p>
            )}
          </div>

          {/* Mood Volatility */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Mood Volatility Analysis</h3>
            </div>
            {reportData.moodVolatility && reportData.moodVolatility.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.moodVolatility}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" style={{ fontSize: '11px' }} />
                  <YAxis domain={[-40, 40]} style={{ fontSize: '12px' }} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const change = payload[0].value;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="text-sm font-semibold">{payload[0].payload.day}</p>
                          <p className="text-sm">Change: {change > 0 ? '+' : ''}{change}</p>
                          <p className="text-xs text-gray-500">
                            {Math.abs(change) < 10 ? 'Stable' : Math.abs(change) < 20 ? 'Moderate' : 'High volatility'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Bar 
                    dataKey="change" 
                    fill="#6366F1" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-16">Not enough data for volatility analysis</p>
            )}
          </div>
        </div>

        {/* Clinical Insights & Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Clinical Insights & Professional Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.overallScore >= 70 && (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-green-800 font-semibold mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2" /> Positive Mental Health Status
                </p>
                <p className="text-sm text-green-700">Your mental health indicators are within healthy ranges. Continue current wellness practices.</p>
              </div>
            )}
            
            {reportData.moodAnalytics?.emotionalStability < 50 && (
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-orange-800 font-semibold mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" /> Emotional Fluctuations Detected
                </p>
                <p className="text-sm text-orange-700">Consider mindfulness practices or speaking with a counselor about mood regulation techniques.</p>
              </div>
            )}
            
            {reportData.moodAnalytics?.riskLevel >= 50 && (
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <p className="text-red-800 font-semibold mb-2 flex items-center">
                  <Heart className="h-5 w-5 mr-2" /> Professional Support Recommended
                </p>
                <p className="text-sm text-red-700">High frequency of negative moods detected. We recommend consulting with a mental health professional.</p>
              </div>
            )}
            
            {reportData.chatStats?.totalMessages < 10 && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-blue-800 font-semibold mb-2 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" /> Increase Therapeutic Engagement
                </p>
                <p className="text-sm text-blue-700">Regular AI conversations can help process emotions and develop coping strategies.</p>
              </div>
            )}
            
            {reportData.journalStats.totalEntries < 5 && (
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-800 font-semibold mb-2 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" /> Establish Journaling Routine
                </p>
                <p className="text-sm text-purple-700">Daily journaling is a proven therapeutic technique for emotional processing and self-awareness.</p>
              </div>
            )}
            
            {reportData.wellnessDimensions && reportData.wellnessDimensions.find(d => d.dimension === 'Social' && d.score < 40) && (
              <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                <p className="text-indigo-800 font-semibold mb-2 flex items-center">
                  <Zap className="h-5 w-5 mr-2" /> Enhance Social Connectivity
                </p>
                <p className="text-sm text-indigo-700">Low social engagement detected. Consider reaching out to supportive friends or joining community activities.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalStatusReport;
