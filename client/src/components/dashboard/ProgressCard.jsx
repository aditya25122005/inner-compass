import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; 
import { Zap, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
const ProgressCard = () => {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    const defaultMetrics = { 
        complianceRate: 0, 
        weeklyActivityData: [ 
            { week: 'Wk 1', score: 0 }, { week: 'Wk 2', score: 0 },
            { week: 'Wk 3', score: 0 }, { week: 'Wk 4', score: 0 }
        ]
    };

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!token) { setLoading(false); return; }
            try {
                // Fetch data using the dedicated dashboardAPI service
                const data = await dashboardAPI.getDashboardData();
                setMetrics(data);
            } catch (err) {
                console.error("Progress Card API Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [token]);


    const data = metrics || defaultMetrics;
    const { complianceRate, weeklyActivityData } = data;

    if (loading) {
         return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Progress & Activity</h3>
                <span className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors cursor-pointer">Details →</span>
            </div>
            
            {/* Task Compliance Rate */}
            <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-base font-semibold text-gray-700 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-600" /> Task Compliance
                    </h4>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{complianceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-700 shadow-md" 
                        style={{ width: `${complianceRate}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Completion rate for wellness tasks</p>
            </div>

            {/* Weekly Activity Chart (Sentiment Trend Visualization) */}
            <div className="flex-1 flex flex-col">
                <h4 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-500" /> Weekly Wellness Trend
                </h4>
                <div className="flex-1 w-full min-h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9333EA" stopOpacity={0.9}/>
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.6}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#6B7280" domain={[0, 100]} style={{ fontSize: '11px' }} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#ffffff', 
                                    border: '1px solid #E5E7EB', 
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }} 
                                itemStyle={{ color: '#374151', fontWeight: '600' }}
                                formatter={(value) => [`${value} pts`, 'Score']}
                            />
                            <Bar dataKey="score" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressCard;