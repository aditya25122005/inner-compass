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
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Mental Status Overview</h3>
                
                <div className="relative w-40 h-40 mx-auto mb-4">
                    {/* SVG Ring Visualization */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background Ring */}
                        <circle 
                            cx="60" cy="60" r={radius} 
                            fill="none" stroke="#E5E7EB" 
                            strokeWidth="15" 
                        />
                        {/* Progress Ring */}
                        <circle 
                            cx="60" cy="60" r={radius} 
                            fill="none" stroke={status.range} 
                            strokeWidth="15" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={offset} 
                            strokeLinecap="round" 
                            className="transition-all duration-1000 ease-in-out"
                        />
                    </svg>
                    
                    {/* Score Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold text-gray-900">{mentalScore}</span>
                        <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
                    </div>
                </div>
            </div>
            <div className='mt-auto'>
                <p className="text-sm text-gray-600 mt-2">Latest Mood: <span className="font-semibold">{latestJournalMood || 'N/A'}</span></p>
                <p className="text-xs text-gray-400 mt-1">Score derived from latest journal sentiment.</p>
            </div>
        </div>
    );
};

export default MentalStatusCard;
