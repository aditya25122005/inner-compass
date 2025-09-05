import ActivityCard from './components/dashboard/activity.jsx';
import ProgressCard from './components/dashboard/progress';
import MentalStatusCard from './components/dashboard/status.jsx';
import React, { useState } from 'react';
import { LucideLogOut, LucideSettings, LucideUserCircle2, LucideChevronLeft, LucideDatabase, LucideFileText, LucideInfo, LucideUpload } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DemoNotification from './components/DemoNotification';
import MedicalReports from './components/MedicalReports';
import DailyTasks from './components/DailyTasks';
import UserDropdown from './components/UserDropdown';
import ProfileCard from './components/dashboard/profile';
import './App.css';

// ✅ Dashboard component for authenticated users
const DashboardApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, logout, updateProfile, uploadProfilePicture } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});

  // ✅ Initialize form data once when user is available
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

  // ✅ Ensure token is included when updating profile
  const handleProfileUpdate = async (updateData) => {
    if (typeof updateData === 'object' && updateData !== null) {
      const result = await updateProfile(updateData); // updateProfile should internally use token
      return result;
    } else {
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

  // ✅ Ensure file upload also includes JWT token
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

  // ... (your MentalStatusCard, ProgressCard, ActivityCard remain unchanged)

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

  // ... (other settings components unchanged)

  const handleNavigateToSettings = () => {
    setCurrentView('settings');
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
            {/* ✅ All cards */}
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

// ✅ Authentication wrapper component
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

  // ✅ User must log in first
  if (!isAuthenticated) {
    return authView === 'login' ? 
      <Login onSwitchToRegister={() => setAuthView('register')} /> :
      <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  return <DashboardApp />;
};

// ✅ Main App component
const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;
