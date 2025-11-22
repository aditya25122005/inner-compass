import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
  MessageCircle,
  BarChart3,
  BookOpen,
  LogOut,
  Home,
  Search,
  HeartPulse,
  UserCircle2,
} from "lucide-react";

import JournalCompact from "../components/dashboard/JournalCompact";
import MentalStatusCard from "../components/dashboard/MentalStatusCard";
import ProgressCard from "../components/dashboard/ProgressCard";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <div className="text-center p-8">You are not logged in.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF3FF] via-[#F6F0FF] to-[#EAF7FF] animate-gradient font-sans">
      
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/70 shadow-md border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl shadow-md">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                InnerCompass Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
          </div>

          {/* Profile + Logout */}
          <div className="flex items-center space-x-5">
            <Link
              to="/profile"
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <UserCircle2 className="h-9 w-9 text-indigo-600" />
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-6">

        {/* Hero Section */}
        <div className="card animate-slide-up border border-gray-200 overflow-hidden mb-12 animate-fade-in relative p-10 rounded-2xl">
          
          {/* FIX: Always Visible Image */}
          <div className="absolute right-6 bottom-2 opacity-40 pointer-events-none">
            <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgIXABaIpwwfXev7drAmGlEfWLM0G0zZEBfQ&s"
              alt="wellness"
              className="w-56 select-none"
            />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-3 relative z-10">
            Hey {user?.name || "there"}, how are you feeling today?
          </h2>
          
          <p className="text-gray-600 text-lg max-w-xl relative z-10">
            Your safe space to track your emotions, reflect, and grow healthier
            mentally. We're here for you.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* AI Chat */}
          <Link to="/chatbot" className="card animate-slide-up hover:scale-[1.02] transition-transform">
            <FeatureCard
              icon={<MessageCircle className="h-9 w-9 text-white" />}
              title="AI Companion"
              subtitle="Talk with InnerCompass AI"
              desc="Get emotional support, chat safely, and explore your thoughts with AI."
              bg="from-blue-400 to-indigo-500"
            />
          </Link>

          <div className="card animate-slide-up">
            <MentalStatusCard />
          </div>

          <div className="card animate-slide-up">
            <ProgressCard />
          </div>

          {/* Tasks */}
          <Link to="/tasks" className="card animate-slide-up hover:scale-[1.02] transition-transform">
            <FeatureCard
              icon={<BarChart3 className="h-9 w-9 text-white" />}
              title="Daily Task Manager"
              subtitle="Improve yourself"
              desc="AI-personalized tasks updated every journal entry."
              bg="from-green-500 to-emerald-600"
            />
          </Link>

          {/* Journal */}
          <div className="card animate-slide-up hover:scale-[1.02] cursor-pointer transition-transform">
            <JournalCompact />
          </div>

          {/* Resources */}
          <Link to="/resources" className="card animate-slide-up hover:scale-[1.02] transition-transform">
            <FeatureCard
              icon={<HeartPulse className="h-9 w-9 text-white" />}
              title="Nearby Doctors"
              subtitle="Find mental-health support"
              desc="Locate trusted therapists and psychiatrists near you."
              bg="from-orange-400 to-red-500"
            />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="card animate-slide-up mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-4">
            <QuickButton to="/chatbot" color="from-blue-500 to-indigo-600">
              <MessageCircle className="h-4 w-4 mr-2" /> Start AI Chat
            </QuickButton>

            <QuickButton to="/tasks" color="from-green-500 to-green-700">
              <BarChart3 className="h-4 w-4 mr-2" /> Track Tasks
            </QuickButton>

            <QuickButton to="/journal" color="from-purple-500 to-purple-700">
              <BookOpen className="h-4 w-4 mr-2" /> Write Journal
            </QuickButton>

            <QuickButton to="/resources" color="from-yellow-500 to-yellow-600">
              <Search className="h-4 w-4 mr-2" /> Find Resources
            </QuickButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

/* ---------------- Reusable Components ---------------- */

const FeatureCard = ({ icon, title, subtitle, desc, bg }) => {
  return (
    <div className="card animate-slide-up h-full transition-all duration-300 p-6 rounded-xl bg-white shadow-md border border-gray-200">
      
      {/* FIX: removed group-hover */}
      <div
        className={`bg-gradient-to-r ${bg} p-3 rounded-xl shadow-md mb-4 w-fit transition-transform hover:scale-110`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
      <p className="text-gray-600 text-sm mt-3">{desc}</p>
    </div>
  );
};

const QuickButton = ({ to, children, color }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${color} text-white rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105 text-sm font-medium`}
    >
      {children}
    </Link>
  );
};
