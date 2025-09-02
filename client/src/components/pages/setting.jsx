import React, { useState } from 'react';
import { LucideChevronLeft, LucideLogOut, LucideUserCircle2, LucideDatabase, LucideFileText, LucideInfo } from 'lucide-react';
import EditProfile from '../settings/edit';
import SubscriptionDetails from '../settings/subscribe';
import ReportsHistory from '../settings/history';
import MoreSettings from '../settings/more';

const Settings = ({ profileImageUrl, setProfileImageUrl, onNavigateToDashboard, onSignOut }) => {
  const [settingsView, setSettingsView] = useState('profile');

  const renderSettingsContent = () => {
    switch (settingsView) {
      case 'profile':
        return <EditProfile profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl} />;
      case 'subscription':
        return <SubscriptionDetails />;
      case 'reports':
        return <ReportsHistory />;
      case 'more':
        return <MoreSettings />;
      default:
        return <EditProfile profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 p-8 md:p-12 lg:p-16">
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={onNavigateToDashboard}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <LucideChevronLeft size={24} className="mr-2" />
          <span className="text-lg">Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <button
          onClick={onSignOut}
          className="flex items-center text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-full font-semibold"
        >
          <LucideLogOut size={16} className="mr-2" /> Log Out
        </button>
      </header>

      <div className="settings-layout-container">
        <div className="settings-sidebar">
          <div className="settings-menu">
            <button
              onClick={() => setSettingsView('profile')}
              className={`settings-menu-item ${settingsView === 'profile' ? 'active' : ''}`}
            >
              <LucideUserCircle2 size={20} className="menu-icon" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setSettingsView('subscription')}
              className={`settings-menu-item ${settingsView === 'subscription' ? 'active' : ''}`}
            >
              <LucideDatabase size={20} className="menu-icon" />
              <span>Subscription</span>
            </button>
            <button
              onClick={() => setSettingsView('reports')}
              className={`settings-menu-item ${settingsView === 'reports' ? 'active' : ''}`}
            >
              <LucideFileText size={20} className="menu-icon" />
              <span>Reports History</span>
            </button>
            <button
              onClick={() => setSettingsView('more')}
              className={`settings-menu-item ${settingsView === 'more' ? 'active' : ''}`}
            >
              <LucideInfo size={20} className="menu-icon" />
              <span>More Settings</span>
            </button>
          </div>
        </div>
        <div className="settings-content-area">
          {renderSettingsContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;