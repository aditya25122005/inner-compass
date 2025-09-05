import React, { useState, useEffect, useRef } from 'react';

const Settings = () => {
  const [profileData, setProfileData] = useState({
    name: 'Himanshu',
    age: '22',
    gender: 'Male'
  });
  
  const [originalProfileData, setOriginalProfileData] = useState({
    name: 'himanshu',
    age: '22',
    gender: 'Male'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState('more');
  const [profileImage, setProfileImage] = useState('https://media.licdn.com/dms/image/v2/D5603AQGN1CX_mqgqSA/profile-displayphoto-crop_800_800/B56Zi3yW.DG0AI-/0/1755430091583?e=1759968000&v=beta&t=7fUvkSE9K0_u2bxIQ--FXzeeO9TK6zpGp0l7Jf2rleg');
  const [notifications, setNotifications] = useState([]);
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    email: true,
    autoSync: true
  });

  const fileInputRef = useRef(null);

  // Initialize component
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Load user preferences
  const loadUserPreferences = () => {
    // In a real app, this would load from an API or localStorage
    const savedPreferences = {
      notifications: true,
      darkMode: false,
      email: true,
      autoSync: true
    };
    setPreferences(savedPreferences);
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 4000);
  };

  // Toggle edit mode
  const toggleEdit = (field) => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  // Save profile changes
  const saveChanges = () => {
    if (!validateProfileData(profileData.name, profileData.age)) {
      return;
    }

    setOriginalProfileData({ ...profileData });
    setIsEditing(false);
    showNotification('Profile updated successfully!', 'success');
  };

  // Cancel changes
  const cancelChanges = () => {
    setProfileData({ ...originalProfileData });
    setIsEditing(false);
    showNotification('Changes cancelled', 'info');
  };

  // Validate profile data
  const validateProfileData = (name, age) => {
    if (!name || name.trim().length < 2) {
      showNotification('Please enter a valid name (at least 2 characters)', 'error');
      return false;
    }

    if (!age || age < 16 || age > 100) {
      showNotification('Please enter a valid age (16-100)', 'error');
      return false;
    }

    return true;
  };

  // Handle preference changes
  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    if (key === 'darkMode') {
      document.body.classList.toggle('dark-mode', value);
    }
    
    showNotification(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`, 'success');
  };

  // Handle profile picture change
  const changeProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        showNotification('Profile picture updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigation functions
  const showSection = (section) => {
    setCurrentSection(section);
  };

  // Action functions
  const viewReport = (reportId) => {
    showNotification(`Opening report: ${reportId}`, 'info');
  };

  const manageBilling = () => {
    showNotification('Opening billing management...', 'info');
  };

  const updatePayment = () => {
    showNotification('Opening payment method update...', 'info');
  };

  const upgradePlan = () => {
    showNotification('Opening plan upgrade options...', 'info');
  };

  const cancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      showNotification('Subscription cancellation initiated. Check your email for details.', 'info');
    }
  };

  const downloadData = () => {
    showNotification('Preparing your data download...', 'info');
    setTimeout(() => {
      const data = {
        profile: originalProfileData,
        preferences,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inner-compass-data.json';
      a.click();
      URL.revokeObjectURL(url);
      
      showNotification('Data download started!', 'success');
    }, 2000);
  };

  const confirmDeleteAccount = () => {
    const confirmation = window.prompt('This action cannot be undone. Type "DELETE" to confirm:');
    if (confirmation === 'DELETE') {
      showNotification('Account deletion request submitted. Check your email for confirmation.', 'info');
    } else {
      showNotification('Account deletion cancelled.', 'info');
    }
  };

  const logout = () => {
    if (isEditing) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to log out?')) {
        return;
      }
    }
    
    showNotification('Logging out...', 'info');
    setTimeout(() => {
      showNotification('Successfully logged out!', 'success');
    }, 1000);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      default: return 'fa-info-circle';
    }
  };

  // Render notification
  const Notification = ({ notification, onRemove }) => (
    <div className={`notification ${notification.type} show`}>
      <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
      <span>{notification.message}</span>
    </div>
  );

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange, id }) => (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        id={id}
      />
      <span className="slider"></span>
    </label>
  );

  return (
    <div className="settings-container">
      <style jsx>{`
        :root {
            --primary-color: #2563eb;
            --primary-hover: #1d4ed8;
            --secondary-color: #64748b;
            --success-color: #059669;
            --danger-color: #dc2626;
            --warning-color: #d97706;
            --background-color: #f8fafc;
            --card-background: #ffffff;
            --sidebar-background: #f1f5f9;
            --border-color: #e2e8f0;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-muted: #94a3b8;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --radius-sm: 0.375rem;
            --radius-md: 0.5rem;
            --radius-lg: 0.75rem;
            --radius-xl: 1rem;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--background-color);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .settings-container {
            display: flex;
            min-height: 100vh;
            position: relative;
        }

        /* Sidebar Styles */
        .sidebar {
            width: 400px;
            background: linear-gradient(135deg, var(--sidebar-background) 0%, #e2e8f0 100%);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            border-right: 1px solid var(--border-color);
            position: relative;
            overflow-y: auto;
        }

        .sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), #3b82f6, #06b6d4);
        }

        .profile-card {
            background: var(--card-background);
            border-radius: var(--radius-xl);
            padding: 2rem;
            text-align: center;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
            position: relative;
            overflow: hidden;
        }

        .profile-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color)/10, #3b82f6/10);
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }

        .profile-pic-container {
            position: relative;
            display: inline-block;
            margin-bottom: 1.5rem;
        }

        .profile-pic {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            border: 4px solid var(--card-background);
            box-shadow: var(--shadow-md);
            position: relative;
            z-index: 2;
            object-fit: cover;
        }

        .profile-edit-overlay {
            position: absolute;
            top: 2%;
            left: 4%;
            right: 4%;
            bottom: 8%;
            background: rgba(161, 163, 166, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
            z-index: 3;
        }

        .profile-pic-container:hover .profile-edit-overlay {
            opacity: 1;
        }

        .profile-edit-overlay i {
            color: white;
            font-size: 1.2rem;
        }

        .profile-field {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            position: relative;
        }

        .field-label {
            position: absolute;
            left: 12px;
            top: -8px;
            background: var(--card-background);
            padding: 0 0.5rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-weight: 500;
            z-index: 1;
        }

        .edit-field, .select-field {
            flex: 1;
            border: 2px solid var(--border-color);
            padding: 0.87rem 1rem;
            border-radius: var(--radius-md);
            background: var(--card-background);
            font-size: 1rem;
            color: var(--text-primary);
            transition: all 0.3s ease;
            font-family: inherit;
        }

        .edit-field:focus, .select-field:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--primary-color)/10;
        }

        .edit-field[readonly] {
            background: var(--background-color);
            border-color: var(--border-color);
            cursor: default;
        }

        .edit-field:not([readonly]) {
            background: #eff6ff;
            border-color: var(--primary-color);
        }

        .select-field[disabled] {
            background: var(--background-color);
            cursor: not-allowed;
            opacity: 0.6;
        }

        .edit-button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.25rem;
            margin-left: 0.75rem;
            padding: 0.5rem;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }

        .edit-button:hover {
            background: var(--primary-color)/10;
            color: var(--primary-color);
            transform: scale(1.1);
        }

        .button-group {
            display: flex;
            gap: 0.75rem;
            margin-top: 2rem;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }

        .button-group.show {
            opacity: 1;
            transform: translateY(0);
        }

        .save-button, .cancel-button {
            flex: 1;
            padding: 0.875rem 1.5rem;
            border-radius: var(--radius-md);
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .save-button {
            background: linear-gradient(135deg, var(--success-color), #10b981);
            color: white;
            box-shadow: var(--shadow-sm);
        }

        .save-button:hover {
            background: linear-gradient(135deg, #047857, var(--success-color));
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .cancel-button {
            background: var(--background-color);
            color: var(--text-secondary);
            border: 2px solid var(--border-color);
        }

        .cancel-button:hover {
            background: #f1f5f9;
            border-color: var(--text-secondary);
            transform: translateY(-1px);
        }

        /* Navigation Styles */
        .settings-nav {
            margin-top: 2rem;
        }

        .nav-item {
            display: flex;
            align-items: center;
            padding: 1rem 1.25rem;
            margin-bottom: 0.5rem;
            border-radius: var(--radius-lg);
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .nav-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: var(--primary-color);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }

        .nav-item:hover, .nav-item.active {
            background: var(--card-background);
            color: var(--primary-color);
            box-shadow: var(--shadow-sm);
            transform: translateX(4px);
        }

        .nav-item.active::before {
            transform: scaleY(1);
        }

        .nav-item i {
            margin-right: 0.875rem;
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
        }

        /* Main Content Styles */
        .main-settings {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }

        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            background: var(--card-background);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            margin-bottom: 2rem;
        }

        .settings-title {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
        }

        .logout-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--danger-color);
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-md);
            border: 2px solid var(--danger-color)/20;
            transition: all 0.3s ease;
        }

        .logout-link:hover {
            background: var(--danger-color);
            color: white;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .logout-link i {
            margin-left: 0.5rem;
            font-size: 0.9rem;
        }

        .settings-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .settings-section {
            background: var(--card-background);
            border-radius: var(--radius-xl);
            padding: 2rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }

        .settings-section:hover {
            box-shadow: var(--shadow-md);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
        }

        .section-title i {
            margin-right: 0.75rem;
            color: var(--primary-color);
        }

        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }

        .setting-item:last-child {
            border-bottom: none;
        }

        .setting-item:hover {
            background: var(--background-color)/50;
            margin: 0 -1rem;
            padding: 1rem;
            border-radius: var(--radius-md);
        }

        .setting-label {
            font-weight: 500;
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
        }

        .setting-description {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }

        /* Enhanced Switch Styles */
        .switch {
            position: relative;
            display: inline-block;
            width: 56px;
            height: 32px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #cbd5e1;
            transition: 0.4s;
            border-radius: 32px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 4px;
            bottom: 4px;
            background: white;
            transition: 0.4s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        input:checked + .slider {
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
        }

        input:checked + .slider:before {
            transform: translateX(24px);
        }

        /* Links and Actions */
        .setting-links {
            display: grid;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .setting-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--primary-color);
            font-weight: 500;
            padding: 0.875rem 1rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }

        .setting-link:hover {
            background: var(--primary-color)/5;
            border-color: var(--primary-color)/30;
            transform: translateX(4px);
        }

        .setting-link i {
            margin-right: 0.75rem;
            font-size: 1rem;
        }

        .setting-link.danger {
            color: var(--danger-color);
        }

        .setting-link.danger:hover {
            background: var(--danger-color)/5;
            border-color: var(--danger-color)/30;
        }

        /* Full Width Sections */
        .full-width-section {
            grid-column: 1 / -1;
        }

        .report-row, .subscription-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            background: var(--background-color);
            border-radius: var(--radius-lg);
            margin-bottom: 1rem;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }

        .report-row:hover, .subscription-row:hover {
            background: var(--card-background);
            box-shadow: var(--shadow-sm);
            transform: translateY(-1px);
        }

        .report-info, .subscription-info {
            display: flex;
            flex-direction: column;
        }

        .report-title, .subscription-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }

        .report-date, .subscription-detail {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        .view-button, .manage-button {
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-md);
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-sm);
        }

        .view-button:hover, .manage-button:hover {
            background: linear-gradient(135deg, var(--primary-hover), var(--primary-color));
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        /* Status Indicators */
        .status-badge {
            padding: 0.375rem 0.875rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .status-active {
            background: var(--success-color)/10;
            color: var(--success-color);
        }

        .status-warning {
            background: var(--warning-color)/10;
            color: var(--warning-color);
        }

        /* Notifications */
        .notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            color: white;
            font-weight: 500;
            box-shadow: var(--shadow-lg);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            background: linear-gradient(135deg, var(--success-color), #10b981);
        }

        .notification.info {
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .settings-container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                padding: 1rem;
            }
            
            .settings-content {
                grid-template-columns: 1fr;
            }
            
            .main-settings {
                padding: 1rem;
            }
        }

        /* Dark mode styles (when enabled) */
        body.dark-mode {
            --background-color: #0f172a;
            --card-background: #1e293b;
            --sidebar-background: #334155;
            --border-color: #475569;
            --text-primary: #f1f5f9;
            --text-secondary: #cbd5e1;
            --text-muted: #94a3b8;
        }

        /* Loading states and animations */
        .loading {
            opacity: 0.6;
            pointer-events: none;
            position: relative;
        }

        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--background-color);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }
      `}</style>

      {/* Hidden file input for profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Notifications */}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-card">
          <div className="profile-pic-container">
            <img src={profileImage} alt="Admin Profile" className="profile-pic" />
            <div className="profile-edit-overlay" onClick={changeProfilePicture}>
              <i className="fas fa-camera"></i>
            </div>
          </div>
          
          <div className="profile-field">
            <span className="field-label">Full Name</span>
            <input
              type="text"
              value={profileData.name}
              readOnly={!isEditing}
              className="edit-field"
              onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
              onClick={() => toggleEdit('name')}
              title="Edit name"
            />
          </div>
          
          <div className="profile-field">
            <span className="field-label">Age</span>
            <input
              type="number"
              value={profileData.age}
              readOnly={!isEditing}
              className="edit-field"
              min="16"
              max="100"
              onChange={(e) => setProfileData(prev => ({...prev, age: e.target.value}))}
              onClick={() => toggleEdit('age')}
              title="Edit age"
            />
          </div>
          
          <div className="profile-field">
            <span className="field-label">Gender</span>
            <select
              className="select-field"
              value={profileData.gender}
              disabled={!isEditing}
              onChange={(e) => setProfileData(prev => ({...prev, gender: e.target.value}))}
              onClick={() => toggleEdit('gender')}
              title="Edit gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          
          <div className="button-group">
            <button className="save-button" onClick={saveChanges}>
              <i className="fas fa-save"></i> Save Changes
            </button>
            <button className="cancel-button" onClick={cancelChanges}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
        
        <nav className="settings-nav">
          <div
            className={`nav-item ${currentSection === 'general' || currentSection === 'more' ? 'active' : ''}`}
            onClick={() => showSection('general')}
          >
            <i className="fas fa-cog"></i> General Settings
          </div>
          <div
            className={`nav-item ${currentSection === 'subscription' ? 'active' : ''}`}
            onClick={() => showSection('subscription')}
          >
            <i className="fas fa-crown"></i> Subscription
          </div>
          <div
            className={`nav-item ${currentSection === 'reports' ? 'active' : ''}`}
            onClick={() => showSection('reports')}
          >
            <i className="fas fa-chart-line"></i> Reports History
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-settings">
        <header className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <div className="logout-link" onClick={logout}>
            Log Out <i className="fas fa-sign-out-alt"></i>
          </div>
        </header>

        <div className="settings-content">
          {/* More Settings Section (Default) */}
          {(currentSection === 'general' || currentSection === 'more') && (
            <>
              <section className="settings-section">
                <h3 className="section-title">
                  <i className="fas fa-sliders-h"></i>
                  Preferences
                </h3>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Push Notifications</span>
                    <span className="setting-description">Receive notifications about important updates</span>
                  </div>
                  <ToggleSwitch
                    checked={preferences.notifications}
                    onChange={(value) => handlePreferenceChange('notifications', value)}
                    id="notifications-toggle"
                  />
                </div>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Dark Mode</span>
                    <span className="setting-description">Switch to dark theme for better viewing</span>
                  </div>
                  <ToggleSwitch
                    checked={preferences.darkMode}
                    onChange={(value) => handlePreferenceChange('darkMode', value)}
                    id="dark-mode-toggle"
                  />
                </div>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Email Notifications</span>
                    <span className="setting-description">Receive updates via email</span>
                  </div>
                  <ToggleSwitch
                    checked={preferences.email}
                    onChange={(value) => handlePreferenceChange('email', value)}
                    id="email-toggle"
                  />
                </div>
                <div className="setting-item">
                  <div className="setting-label">
                    <span>Auto Sync</span>
                    <span className="setting-description">Automatically sync data across devices</span>
                  </div>
                  <ToggleSwitch
                    checked={preferences.autoSync}
                    onChange={(value) => handlePreferenceChange('autoSync', value)}
                    id="sync-toggle"
                  />
                </div>
              </section>

              <section className="settings-section">
                <h3 className="section-title">
                  <i className="fas fa-info-circle"></i>
                  About
                </h3>
                <div className="setting-item">
                  <span className="setting-label">App Version</span>
                  <span className="status-badge status-active">v10.00.01</span>
                </div>
                <div className="setting-item">
                  <span className="setting-label">Last Updated</span>
                  <span>September 1, 2025</span>
                </div>
                <div className="setting-links">
                  <div className="setting-link">
                    <i className="fas fa-file-contract"></i>
                    Terms & Conditions
                  </div>
                  <div className="setting-link">
                    <i className="fas fa-shield-alt"></i>
                    Privacy Policy
                  </div>
                  <div className="setting-link">
                    <i className="fas fa-question-circle"></i>
                    Help Center / FAQs
                  </div>
                </div>
              </section>

              {/* Data & Account Section */}
              <section className="settings-section full-width-section">
                <h3 className="section-title">
                  <i className="fas fa-database"></i>
                  Data & Account
                </h3>
                <div className="setting-links">
                  <div className="setting-link" onClick={downloadData}>
                    <i className="fas fa-download"></i>
                    Download My Data
                  </div>
                  <div className="setting-link">
                    <i className="fas fa-bug"></i>
                    Report a Bug / Feedback
                  </div>
                  <div className="setting-link danger" onClick={confirmDeleteAccount}>
                    <i className="fas fa-trash-alt"></i>
                    Delete Account
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Reports History Section */}
          {currentSection === 'reports' && (
            <section className="settings-section full-width-section">
              <h3 className="section-title">
                <i className="fas fa-chart-line"></i>
                Reports History
              </h3>
              <div className="report-row">
                <div className="report-info">
                  <span className="report-title">Monthly Wellness Report</span>
                  <span className="report-date">August 2025 • Generated on Sep 1</span>
                </div>
                <button className="view-button" onClick={() => viewReport('monthly-aug-2025')}>
                  <i className="fas fa-eye"></i> View Report
                </button>
              </div>
              <div className="report-row">
                <div className="report-info">
                  <span className="report-title">Quarterly Progress Report</span>
                  <span className="report-date">Q2 2025 • Generated on Jul 1</span>
                </div>
                <button className="view-button" onClick={() => viewReport('quarterly-q2-2025')}>
                  <i className="fas fa-eye"></i> View Report
                </button>
              </div>
              <div className="report-row">
                <div className="report-info">
                  <span className="report-title">Annual Summary Report</span>
                  <span className="report-date">2024 • Generated on Jan 1, 2025</span>
                </div>
                <button className="view-button" onClick={() => viewReport('annual-2024')}>
                  <i className="fas fa-eye"></i> View Report
                </button>
              </div>
            </section>
          )}

          {/* Subscription Section */}
          {currentSection === 'subscription' && (
            <section className="settings-section full-width-section">
              <h3 className="section-title">
                <i className="fas fa-crown"></i>
                Subscription Details
              </h3>
              <div className="subscription-row">
                <div className="subscription-info">
                  <span className="subscription-title">Current Plan: Pro</span>
                  <span className="subscription-detail">Full access to all premium features</span>
                </div>
                <span className="status-badge status-active">Active</span>
              </div>
              <div className="subscription-row">
                <div className="subscription-info">
                  <span className="subscription-title">Next Billing Date</span>
                  <span className="subscription-detail">September 21, 2025 • $19.99/month</span>
                </div>
                <button className="manage-button" onClick={manageBilling}>
                  <i className="fas fa-cog"></i> Manage
                </button>
              </div>
              <div className="subscription-row">
                <div className="subscription-info">
                  <span className="subscription-title">Payment Method</span>
                  <span className="subscription-detail">Visa ending in 1234 • Expires 12/26</span>
                </div>
                <button className="manage-button" onClick={updatePayment}>
                  <i className="fas fa-credit-card"></i> Update
                </button>
              </div>
              <div className="setting-links" style={{marginTop: '2rem'}}>
                <div className="setting-link" onClick={upgradePlan}>
                  <i className="fas fa-arrow-up"></i>
                  Upgrade Plan
                </div>
                <div className="setting-link" onClick={cancelSubscription}>
                  <i className="fas fa-times-circle"></i>
                  Cancel Subscription
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;