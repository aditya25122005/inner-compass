import React from 'react';
import { LucideUserCircle2, LucideSettings, LucideLogOut } from 'lucide-react';
import MentalStatusCard from '../dashboard/status';
import ProgressCard from '../dashboard/progress';
import ProfileCard from '../dashboard/profile';
import ActivityCard from '../dashboard/activity';
import JournalCard from '../dashboard/journal';
import MedicalReportsCompact from '../dashboard/MedicalReportsCompact';
import DailyTasksCompact from '../dashboard/DailyTasksCompact';

const Dashboard = ({ userId, profileImageUrl, onNavigateToSettings, onSignOut }) => (
  <div className="dashboard-container-new">
    <header className="dashboard-header-new">
      <h1 className="dashboard-title-new">Inner Compass</h1>
      <div className="header-controls-new">
        {userId && (
          <span className="user-id-new">User ID: {userId}</span>
        )}
        <button
          onClick={onNavigateToSettings}
          className="header-btn"
          title="Profile"
        >
          <LucideUserCircle2 size={20} />
        </button>
        <button
          onClick={onNavigateToSettings}
          className="header-btn"
          title="Settings"
        >
          <LucideSettings size={20} />
        </button>
        <button 
          onClick={onSignOut} 
          className="logout-btn-new"
        >
          <LucideLogOut size={16} className="mr-2" /> Log Out
        </button>
      </div>
    </header>

    <div className="dashboard-main-new">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-section">
          <MedicalReportsCompact user={{ mentalScore: 85 }} />
        </div>
        <div className="sidebar-section">
          <DailyTasksCompact user={{ mentalScore: 85 }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="main-cards-grid">
          <div className="mental-status-section">
            <MentalStatusCard />
          </div>
          
          <div className="profile-section">
            <ProfileCard profileImageUrl={profileImageUrl} />
          </div>
          
          <div className="progress-section">
            <ProgressCard />
          </div>
          
          <div className="activity-section">
            <ActivityCard />
            <JournalCard />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;