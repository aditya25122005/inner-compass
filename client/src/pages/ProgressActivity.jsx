import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, TrendingUp, Zap, Target, Award, Clock, CheckCircle2, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import chatbotAPI from '../services/chatbotApi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';

const ProgressActivity = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    dailyEngagement: [],
    streakData: null,
    weeklyComparison: [],
    goalProgress: [],
    activityHeatmap: [],
    totalMetrics: {}
  });

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    setLoading(true);
    try {
      // Fetch journal entries
      const journalResponse = await axios.get('http://localhost:5000/api/journal', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch chat stats
      const chatResult = await chatbotAPI.getStats();
      const chatData = chatResult.success ? chatResult.data : { totalMessages: 0, userMessages: 0 };

      const journals = journalResponse.data || [];
      
      // Calculate daily engagement (last 30 days)
      const dailyMap = {};
      const now = new Date();
      
      // Initialize last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyMap[dateStr] = { date: dateStr, journals: 0, chats: 0, total: 0 };
      }
      
      // Count journal entries by day
      journals.forEach(entry => {
        const entryDate = new Date(entry.createdAt);
        const daysDiff = (now - entryDate) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 30) {
          const dateStr = entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (dailyMap[dateStr]) {
            dailyMap[dateStr].journals += 1;
            dailyMap[dateStr].total += 1;
          }
        }
      });

      const dailyEngagement = Object.values(dailyMap);

      // Calculate streaks
      const sortedDates = journals.map(j => new Date(j.createdAt)).sort((a, b) => b - a);
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      if (sortedDates.length > 0) {
        const today = new Date().setHours(0, 0, 0, 0);
        const lastEntry = new Date(sortedDates[0]).setHours(0, 0, 0, 0);
        const daysDiff = (today - lastEntry) / (1000 * 60 * 60 * 24);
        
        if (daysDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
          
          for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]).setHours(0, 0, 0, 0);
            const currDate = new Date(sortedDates[i]).setHours(0, 0, 0, 0);
            const diff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
            
            if (diff === 1) {
              tempStreak++;
              currentStreak = tempStreak;
            } else if (diff > 1) {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);
        }
      }

      // Weekly comparison (last 4 weeks)
      const weeklyData = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const weekJournals = journals.filter(j => {
          const jDate = new Date(j.createdAt);
          return jDate >= weekStart && jDate < weekEnd;
        });
        
        weeklyData.push({
          week: `Week ${4 - i}`,
          entries: weekJournals.length,
          avgPerDay: parseFloat((weekJournals.length / 7).toFixed(1))
        });
      }

      // Goal progress
      const monthlyGoal = 20; // 20 entries per month
      const weeklyGoal = 5; // 5 entries per week
      
      const thisMonthEntries = journals.filter(j => {
        const jDate = new Date(j.createdAt);
        return jDate.getMonth() === now.getMonth() && jDate.getFullYear() === now.getFullYear();
      }).length;
      
      const thisWeekEntries = journals.filter(j => {
        const jDate = new Date(j.createdAt);
        const daysDiff = (now - jDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length;

      const goalProgress = [
        {
          goal: 'Weekly Goal',
          target: weeklyGoal,
          achieved: thisWeekEntries,
          percentage: Math.min((thisWeekEntries / weeklyGoal) * 100, 100)
        },
        {
          goal: 'Monthly Goal',
          target: monthlyGoal,
          achieved: thisMonthEntries,
          percentage: Math.min((thisMonthEntries / monthlyGoal) * 100, 100)
        }
      ];

      // Activity heatmap (last 7 days hour distribution)
      const hourMap = Array(24).fill(0);
      journals.slice(0, 50).forEach(entry => {
        const hour = new Date(entry.createdAt).getHours();
        hourMap[hour]++;
      });
      
      const activityHeatmap = hourMap.map((count, hour) => ({
        hour: hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
        activity: count
      }));

      // Total metrics
      const totalMetrics = {
        totalEntries: journals.length,
        totalChats: chatData.totalMessages,
        currentStreak,
        longestStreak,
        avgPerWeek: parseFloat((journals.length / Math.max(Math.ceil(journals.length > 0 ? 
          ((now - new Date(journals[journals.length - 1].createdAt)) / (1000 * 60 * 60 * 24 * 7)) : 1), 1)).toFixed(1)),
        lastActive: journals.length > 0 ? new Date(journals[0].createdAt).toLocaleDateString() : 'Never'
      };

      setActivityData({
        dailyEngagement,
        streakData: { current: currentStreak, longest: longestStreak },
        weeklyComparison: weeklyData,
        goalProgress,
        activityHeatmap: activityHeatmap.filter(h => h.activity > 0),
        totalMetrics
      });
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">Progress & Activity Tracking</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Flame className="h-8 w-8" />
              <span className="text-3xl font-bold">{activityData.streakData?.current || 0}</span>
            </div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-xs opacity-75 mt-1">Days in a row</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Award className="h-8 w-8" />
              <span className="text-3xl font-bold">{activityData.streakData?.longest || 0}</span>
            </div>
            <p className="text-sm opacity-90">Longest Streak</p>
            <p className="text-xs opacity-75 mt-1">Best performance</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-8 w-8" />
              <span className="text-3xl font-bold">{activityData.totalMetrics.totalEntries || 0}</span>
            </div>
            <p className="text-sm opacity-90">Total Entries</p>
            <p className="text-xs opacity-75 mt-1">All time</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-8 w-8" />
              <span className="text-3xl font-bold">{activityData.totalMetrics.avgPerWeek || 0}</span>
            </div>
            <p className="text-sm opacity-90">Weekly Average</p>
            <p className="text-xs opacity-75 mt-1">Entries per week</p>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <Target className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Goal Progress</h3>
          </div>
          
          <div className="space-y-6">
            {activityData.goalProgress.map((goal, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-800">{goal.goal}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({goal.achieved}/{goal.target} entries)
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {Math.round(goal.percentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      goal.percentage >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      goal.percentage >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                    style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                  >
                    {goal.percentage >= 100 && (
                      <div className="flex items-center justify-end h-full pr-2">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Engagement Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <Zap className="h-6 w-6 text-yellow-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Daily Engagement (Last 30 Days)</h3>
          </div>
          
          {activityData.dailyEngagement.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={activityData.dailyEngagement}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="journals" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="url(#colorTotal)" 
                  name="Journal Entries"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-16">No engagement data available</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <CalendarIcon className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Weekly Comparison</h3>
            </div>
            
            {activityData.weeklyComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={activityData.weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entries" fill="#8B5CF6" name="Total Entries" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="avgPerDay" stroke="#EF4444" strokeWidth={3} name="Avg/Day" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-16">No weekly data</p>
            )}
          </div>

          {/* Activity Time Heatmap */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Most Active Hours</h3>
            </div>
            
            {activityData.activityHeatmap.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData.activityHeatmap}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" style={{ fontSize: '10px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="activity" fill="#F59E0B" name="Entries" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-16">No activity data</p>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <Activity className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Activity Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{activityData.totalMetrics.totalChats || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Total Chats</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{activityData.totalMetrics.totalEntries || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Journal Entries</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-600">{activityData.totalMetrics.lastActive}</p>
              <p className="text-sm text-gray-600 mt-1">Last Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressActivity;
