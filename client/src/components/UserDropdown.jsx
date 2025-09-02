import React, { useState, useRef, useEffect } from 'react';
import { 
  LucideUserCircle2, 
  LucidePencil, 
  LucideSettings, 
  LucideDatabase, 
  LucideFileText, 
  LucideInfo, 
  LucideLogOut,
  LucideChevronDown,
  LucideUser
} from 'lucide-react';

const UserDropdown = ({ user, onNavigateToSettings, onSignOut, onUpdateProfile, onUploadProfilePicture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    sex: user?.sex || 'Other'
  });
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize edit data when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        age: user.age || '',
        sex: user.sex || 'Other'
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && onUploadProfilePicture) {
      setIsUploading(true);
      const result = await onUploadProfilePicture(file);
      setIsUploading(false);
      if (!result.success) {
        alert('Failed to upload image: ' + result.message);
      }
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      const result = await onUpdateProfile(editData);
      if (result.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.message);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const settingsOptions = [
    {
      id: 'subscription',
      icon: LucideDatabase,
      label: 'Subscription',
      action: () => onNavigateToSettings('subscription')
    },
    {
      id: 'reports',
      icon: LucideFileText,
      label: 'Reports History',
      action: () => onNavigateToSettings('reports')
    },
    {
      id: 'more',
      icon: LucideInfo,
      label: 'More Settings',
      action: () => onNavigateToSettings('more')
    }
  ];

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-dropdown-trigger"
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="user-avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/40x40/505050/FFFFFF?text=User';
              }}
            />
          ) : (
            <LucideUserCircle2 size={24} className="user-avatar-icon" />
          )}
        </div>
        <LucideChevronDown size={16} className={`dropdown-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div className="user-dropdown-menu">
          {/* Profile Card Section */}
          <div className="profile-card-dropdown">
            <div className="profile-image-section-dropdown">
              <div className="profile-image-container-dropdown">
                <div className="profile-image-wrapper-dropdown">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="profile-image-dropdown"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/80x80/505050/FFFFFF?text=User';
                      }}
                    />
                  ) : (
                    <div className="profile-placeholder-dropdown">
                      <LucideUser size={32} className="placeholder-icon" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="profile-edit-btn-dropdown"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="loading-spinner-sm" />
                    ) : (
                      <LucidePencil size={12} />
                    )}
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="profile-info-dropdown">
              {isEditing ? (
                <form onSubmit={handleProfileSave} className="profile-edit-form">
                  <div className="form-group-dropdown">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="profile-edit-input"
                      placeholder="Name"
                      autoFocus
                    />
                  </div>
                  <div className="form-group-dropdown">
                    <input
                      type="number"
                      value={editData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="profile-edit-input"
                      placeholder="Age"
                      min="13"
                      max="120"
                    />
                  </div>
                  <div className="form-group-dropdown">
                    <select
                      value={editData.sex}
                      onChange={(e) => handleInputChange('sex', e.target.value)}
                      className="profile-edit-select"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="profile-edit-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="profile-name-section">
                    <h3 className="profile-name">{user?.name || 'User'}</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="edit-profile-btn"
                      title="Edit Profile"
                    >
                      <LucidePencil size={14} />
                    </button>
                  </div>
                  <div className="profile-details">
                    <div className="profile-detail-item">
                      <span className="detail-label">Age:</span>
                      <span className="detail-value">{user?.age || 'Not set'}</span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="detail-label">Sex:</span>
                      <span className="detail-value">{user?.sex || 'Not set'}</span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="detail-label">Mental Score:</span>
                      <span className="detail-value mental-score">{user?.mentalScore || 70}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Menu Section */}
          <div className="settings-menu-dropdown">
            <div className="settings-menu-header">
              <LucideSettings size={16} />
              <span>Settings</span>
            </div>
            <div className="settings-options-dropdown">
              {settingsOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className="settings-option-btn"
                >
                  <option.icon size={16} className="option-icon" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Section */}
          <div className="logout-section-dropdown">
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="logout-btn-dropdown"
            >
              <LucideLogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
