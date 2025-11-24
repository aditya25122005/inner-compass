import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, BarChart3, BookOpen, LogOut, Home, Search, HeartPulse, TrendingUp, ArrowRight, User, Settings, ChevronDown } from 'lucide-react';
import axios from 'axios';

import JournalCompact from '../components/dashboard/JournalCompact'; 
import MentalStatusCard from '../components/dashboard/MentalStatusCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import UserProfile from '../components/UserProfile';

const Dashboard = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('https://inner-compass-seven.vercel.app/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(response.data.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const handleProfileUpdate = (updatedProfile) => {
        setProfileData(updatedProfile);
        // Force re-render to update avatar everywhere
        fetchUserProfile();
    };

    if (!user) {
        return <div className="text-center p-8">You are not logged in.</div>;
    }

    const avatarUrl = profileData?.profilePicture;
    const userName = profileData?.name || user?.name || user?.email;
    const userInitial = userName ? userName[0].toUpperCase() : 'U';
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 font-sans">
            <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">InnerCompass</h1>
                                <p className="text-sm text-gray-500">Your Mental Wellness Dashboard</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Avatar Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white font-bold text-lg">{userInitial}</span>
                                        )}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-semibold text-gray-800">{userName}</p>
                                        <p className="text-xs text-gray-500">View Profile</p>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{userName}</p>
                                            <p className="text-xs text-gray-500">{profileData?.email || user?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setProfileModalOpen(true);
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-3 transition-colors"
                                        >
                                            <User className="h-4 w-4 text-purple-600" />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center space-x-3 transition-colors"
                                        >
                                            <Settings className="h-4 w-4 text-purple-600" />
                                            <span>Settings</span>
                                        </button>
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* User Profile Modal */}
            <UserProfile 
                isOpen={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                user={user}
                onProfileUpdate={handleProfileUpdate}
            />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-3">Welcome back, {userName}! 👋</h2>
                        <p className="text-purple-100 text-lg">
                            Take control of your mental well-being with AI-powered tools and personalized insights.
                        </p>
                        <div className="mt-6 flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span>System Active</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <HeartPulse className="h-4 w-4" />
                                <span>Your wellness matters</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    
                    <Link
                        to="/chatbot"
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col min-h-[240px]"
                    >
                         <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:shadow-xl transition-all">
                                <MessageCircle className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">AI Companion</h3>
                                <p className="text-xs text-gray-500">Chat anytime, anywhere</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                            Get emotional support, mood analysis, and personalized wellness guidance from our intelligent AI companion.
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-2 transition-transform mt-auto">
                            <span>Start Conversation</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>

                    <Link
                        to="/mental-status-report"
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col min-h-[240px]"
                    >
                        <MentalStatusCard />
                    </Link>
                    
                    <Link
                        to="/progress-activity"
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col min-h-[240px]"
                    >
                        <ProgressCard />
                    </Link> 

                    <Link
                        to="/tasks" 
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col min-h-[240px]"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-md group-hover:shadow-xl transition-all">
                                <BarChart3 className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Daily Tasks</h3>
                                <p className="text-xs text-gray-500">Stay on track</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                            Track your personalized wellness tasks and maintain your compliance streak for better mental health.
                        </p>
                        <div className="flex items-center text-green-600 text-sm font-semibold group-hover:translate-x-2 transition-transform mt-auto">
                            <span>View Tasks</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[240px]">
                         <JournalCompact />
                    </div>

                    <Link
                        to="/resources"
                        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col min-h-[240px]"
                    >
                         <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl shadow-md group-hover:shadow-xl transition-all">
                                <HeartPulse className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Find Help</h3>
                                <p className="text-xs text-gray-500">Professional support</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">
                            Connect with nearby mental health professionals and support groups for expert guidance.
                        </p>
                        <div className="flex items-center text-yellow-600 text-sm font-semibold group-hover:translate-x-2 transition-transform mt-auto">
                            <span>Find Resources</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>
                    
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Quick Actions</h3>
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/chatbot"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Start AI Chat
                        </Link>
                        <Link
                            to="/tasks"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Track Tasks
                        </Link>
                        <Link
                            to="/journal"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <BookOpen className="h-5 w-5 mr-2" />
                            Write Journal
                        </Link>
                        <Link
                            to="/resources"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            Find Resources
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
