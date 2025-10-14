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
            <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Progress & Activity</h3>
            
            {/* Task Compliance Rate */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-indigo-500" /> Task Compliance
                    </h4>
                    <span className="text-2xl font-bold text-indigo-600">{complianceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700" 
                        style={{ width: `${complianceRate}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Rate of completion for assigned tasks.</p>
            </div>

            {/* Weekly Activity Chart (Sentiment Trend Visualization) */}
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-500" /> Weekly Sentiment Trend
            </h4>
            <div className="flex-1 w-full h-48 min-h-[192px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '10px' }} />
                        <YAxis stroke="#6B7280" domain={[0, 100]} style={{ fontSize: '10px' }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} 
                            itemStyle={{ color: '#ffffff' }}
                            formatter={(value) => [`Score: ${value}`, 'Week']}
                        />
                        <Bar dataKey="score" fill="#4F46E5" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressCard;