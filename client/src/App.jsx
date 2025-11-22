import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import "./styles/animations.css";

import Homepage from './pages/Homepage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
import Journal from './pages/Journal.jsx';
import Resources from './pages/Resources.jsx';
import DailyTasksPage from './pages/DailyTasksPage.jsx';
import ProfilePage from "./pages/ProfilePage.jsx";
import JournalHistory from "./pages/JournalHistory";

import PrivateRoute from './components/PrivateRoute.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    // ⭐ GLOBAL WRAPPER (THEME + ANIMATION)
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] via-[#F7F5FF] to-[#E4F0FF]">

      <AuthProvider>
        <Router>
          <Routes>

            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/chatbot" element={<PrivateRoute><ChatbotPage /></PrivateRoute>} />
            <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><DailyTasksPage /></PrivateRoute>} />

            {/* ⭐ NEW HISTORY PAGE */}
            <Route path="/journal-history" element={<PrivateRoute><JournalHistory /></PrivateRoute>} />

            {/* ⭐ Profile Route */}
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>

    </div>
  );
}

export default App;
