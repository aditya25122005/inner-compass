import React, { useState } from 'react';
import { LucideLogOut, LucideSettings, LucideUserCircle2, LucideChevronLeft, LucideDatabase, LucideFileText, LucideInfo, LucideUpload, LucidePencil } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DemoNotification from './components/DemoNotification';
import MedicalReports from './components/MedicalReports';
import DailyTasks from './components/DailyTasks';
import UserDropdown from './components/UserDropdown';
import ProfileCard from './components/dashboard/profile';
import './App.css';

// Dashboard component for authenticated users
const DashboardApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, logout, updateProfile, uploadProfilePicture } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  
  // Initialize form data only once when user data is available
  React.useEffect(() => {
    if (user && Object.keys(profileFormData).length === 0) {
      setProfileFormData({
        name: user.name || '',
        age: user.age || '',
        sex: user.sex || 'Other'
      });
    }
  }, [user, profileFormData]);

  const handleSignOut = () => {
    logout();
  };

  const handleProfileUpdate = async (updateData) => {
    if (typeof updateData === 'object' && updateData !== null) {
      // Called from UserDropdown with data object
      const result = await updateProfile(updateData);
      return result;
    } else {
      // Called from form submission (e parameter)
      const e = updateData;
      e.preventDefault();
      setIsUpdating(true);
      
      const result = await updateProfile(profileFormData);
      if (result.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.message);
      }
      
      setIsUpdating(false);
      return result;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadProfilePicture(file);
      if (result.success) {
        alert('Profile picture uploaded successfully!');
      } else {
        alert('Failed to upload picture: ' + result.message);
      }
    }
  };

  const MentalStatusCard = () => {
    const mentalScore = user?.mentalScore || 72;
    const mood = user?.mood || 'Balanced';
    
    return (
      <div className="card mental-status-card">
        <h2 className="card-title">Mental Status</h2>
        <div className="mental-status-ring">
          <div className="ring-background"></div>
          <div 
            className="ring-progress"
            style={{
              background: `conic-gradient(#6366f1 ${mentalScore}%, #4b5563 ${mentalScore}%)`
            }}
          ></div>
          <div className="ring-content">
            <span className="status-label">{mood}</span>
            <span className="status-score">{mentalScore}</span>
          </div>
        </div>
        <p className="card-subtitle">Mental Score</p>
      </div>
    );
  };

  const ProgressCard = () => {
    const progress = user?.progressData || { mood: 85, growth: 70, compliance: 60 };
    
    return (
      <div className="card progress-card">
        <h2 className="card-title progress-title">Progress</h2>
        <div className="progress-bars">
          <div className="progress-item">
            <p className="progress-label">Mood</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.mood}%` }}></div>
            </div>
          </div>
          <div className="progress-item">
            <p className="progress-label">Growth</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.growth}%` }}></div>
            </div>
          </div>
          <div className="progress-item">
            <p className="progress-label">Compliance</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress.compliance}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const ActivityCard = () => {
    const activityData = user?.activityData || [
      { week: 'Week 1', score: 70 },
      { week: 'Week 2', score: 80 },
      { week: 'Week 3', score: 85 },
      { week: 'Week 4', score: 75 }
    ];

    return (
      <div className="card activity-card">
        <h2 className="card-title activity-title">Activity</h2>
        <svg viewBox="0 0 400 200" className="activity-chart">
          {activityData.map((data, index) => (
            <g key={index}>
              <text x={40 + index * 80} y="155" className="chart-label">{data.week}</text>
              <circle cx={40 + index * 80} cy={150 - data.score} r="4" fill="#6366f1" />
            </g>
          ))}
          <path d="M 40 20 L 380 20" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
          <path d="M 40 50 L 380 50" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
          <path d="M 40 80 L 380 80" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
          <path d="M 40 110 L 380 110" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
        </svg>
      </div>
    );
  };

  const EditProfile = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Edit Profile</h2>
      <form onSubmit={handleProfileUpdate} className="profile-form">
        <div>
          <label htmlFor="profile-upload" className="form-label">Profile Picture</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="profile-upload"
              onChange={handleFileUpload}
              accept="image/*"
              className="file-upload-input"
            />
            <div className="file-upload-button">
              <LucideUpload size={20} />
              Upload Profile Picture
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            value={profileFormData.name}
            onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
            className="form-input"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="age" className="form-label">Age</label>
          <input
            type="number"
            id="age"
            value={profileFormData.age}
            onChange={(e) => setProfileFormData({...profileFormData, age: e.target.value})}
            className="form-input"
            placeholder="Enter your age"
            min="13"
            max="120"
          />
        </div>
        <div>
          <label htmlFor="sex" className="form-label">Sex</label>
          <select 
            id="sex" 
            value={profileFormData.sex}
            onChange={(e) => setProfileFormData({...profileFormData, sex: e.target.value})}
            className="form-input"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="form-submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );

  const SubscriptionDetails = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Subscription Details</h2>
      <div className="subscription-info">
        <p>Current Plan: {user?.subscription?.plan || 'Free'}</p>
        <p>Next Billing Date: {user?.subscription?.nextBillingDate || 'Not set'}</p>
        <p>Payment Method: {user?.subscription?.paymentMethod || 'Not set'}</p>
        <button className="form-submit">
          Manage Subscription
        </button>
      </div>
    </div>
  );

  const ReportsHistory = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Reports History</h2>
      <div className="reports-list">
        <div className="report-item">
          <span>Monthly Report - August 2025</span>
          <button className="report-button">View</button>
        </div>
        <div className="report-item">
          <span>Quarterly Report - Q2 2025</span>
          <button className="report-button">View</button>
        </div>
      </div>
    </div>
  );

  const MoreSettings = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">More Settings</h2>
      <div className="settings-options">
        <div className="setting-item">
          <span className="setting-label">Notifications</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              className="toggle-input"
              defaultChecked={user?.settings?.notifications}
            />
            <div className="toggle-slider"></div>
            <div className="toggle-knob"></div>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">Dark Mode</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              className="toggle-input" 
              defaultChecked={user?.settings?.darkMode}
            />
            <div className="toggle-slider checked"></div>
            <div className="toggle-knob checked"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const Settings = () => {
    const [settingsView, setSettingsView] = useState('profile');

    const renderSettingsContent = () => {
      switch (settingsView) {
        case 'profile':
          return <EditProfile />;
        case 'subscription':
          return <SubscriptionDetails />;
        case 'reports':
          return <ReportsHistory />;
        case 'more':
          return <MoreSettings />;
        default:
          return <EditProfile />;
      }
    };

    return (
      <div className="settings-page">
        <header className="settings-header">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="back-button"
          >
            <LucideChevronLeft size={24} className="back-icon" />
            <span className="back-text">Back to Dashboard</span>
          </button>
          <h1 className="settings-title">Settings</h1>
          <button
            onClick={handleSignOut}
            className="logout-button"
          >
            <LucideLogOut size={16} className="logout-icon" /> Log Out
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

  const handleNavigateToSettings = (settingsView = 'profile') => {
    setCurrentView('settings');
    // You can extend this to set specific settings view if needed
  };

  const Dashboard = () => (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Inner Compass</h1>
        <div className="header-controls">
          <span className="user-id">Welcome, {user?.username || user?.name}</span>
          <UserDropdown
            user={user}
            onNavigateToSettings={handleNavigateToSettings}
            onSignOut={handleSignOut}
            onUpdateProfile={updateProfile}
            onUploadProfilePicture={uploadProfilePicture}
          />
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-sidebar">
          <MedicalReports user={user} />
          <DailyTasks user={user} />
        </div>
        <div className="dashboard-content">
          <div className="main-cards-grid">
            <MentalStatusCard />
            <ProfileCard user={user} profileImageUrl={user?.profilePicture} />
            <ProgressCard />
            <ActivityCard />
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      <DemoNotification />
      {currentView === 'dashboard' ? <Dashboard /> : <Settings />}
    </>
  );
};

// Authentication wrapper component
const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState('login');

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? 
      <Login onSwitchToRegister={() => setAuthView('register')} /> :
      <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  return <DashboardApp />;
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;
