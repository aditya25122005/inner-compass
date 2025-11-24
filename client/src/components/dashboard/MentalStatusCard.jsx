import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { dashboardAPI } from '../../services/api'; 
const getStatusLabel = (score) => {
    const numericScore = parseFloat(score); 
    
    if (numericScore >= 80) return { label: 'Excellent', color: 'text-green-500', range: '#10B981', status: 'Excellent' };
    if (numericScore >= 60) return { label: 'Balanced', color: 'text-yellow-500', range: '#F59E0B', status: 'Balanced' };
    if (numericScore >= 40) return { label: 'Strained', color: 'text-orange-500', range: '#F97316', status: 'Strained' };
    
    return { label: 'Critical', color: 'text-red-500', range: '#EF4444', status: 'Critical' };
};

const MentalStatusCard = () => {
    const { token } = useAuth(); 
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!token) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }
            try {
                
                const data = await dashboardAPI.getDashboardData(); 

                if (data && data.mentalScore !== undefined) {
                    setMetrics(data);
                } else {
                  
                    setError("Score data is unavailable.");
                }
            } catch (err) {
                setError("Failed to fetch dashboard data. Check backend console.");
                console.error("Dashboard API Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-lg border border-gray-200">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                <p className="ml-3 text-gray-600">Calculating score...</p>
            </div>
        );
    }

    
    const { mentalScore, latestJournalMood } = metrics || { mentalScore: 40, latestJournalMood: 'N/A' }; 
    const status = getStatusLabel(mentalScore);

   
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
  
    const offset = circumference - (mentalScore / 100) * circumference;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Mental Status</h3>
                <span className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors cursor-pointer">Details →</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center py-4">
                <div className="relative w-48 h-48">
                    {/* SVG Ring Visualization */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}>
                        {/* Background Ring */}
                        <circle 
                            cx="80" cy="80" r="70" 
                            fill="none" 
                            stroke="#E5E7EB" 
                            strokeWidth="16" 
                        />
                        {/* Progress Ring */}
                        <circle 
                            cx="80" cy="80" r="70" 
                            fill="none" 
                            stroke={status.range} 
                            strokeWidth="16" 
                            strokeDasharray={2 * Math.PI * 70} 
                            strokeDashoffset={2 * Math.PI * 70 - (mentalScore / 100) * (2 * Math.PI * 70)} 
                            strokeLinecap="round" 
                            className="transition-all duration-1000 ease-out"
                            style={{ filter: `drop-shadow(0 0 8px ${status.range}40)` }}
                        />
                    </svg>
                    
                    {/* Score Text - Centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-extrabold text-gray-900 mb-1">{mentalScore}</span>
                        <span className="text-xs text-gray-400 mb-2">out of 100</span>
                        <span className={`text-base font-bold ${status.color} px-3 py-1 rounded-full bg-gray-50`}>
                            {status.label}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Latest Mood:</span>
                    <span className="text-sm font-semibold text-gray-800 capitalize">{latestJournalMood || 'N/A'}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Based on your recent journal entries</p>
            </div>
        </div>
    );
};

export default MentalStatusCard;
