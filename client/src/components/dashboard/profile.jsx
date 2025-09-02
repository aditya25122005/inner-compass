import React from 'react';
import { LucideUser } from 'lucide-react';

const ProfileCard = ({ profileImageUrl, user }) => (
  <div className="profile-card-content">
    <h2 className="profile-card-title">Profile Overview</h2>
    <div className="profile-display-content">
      <div className="profile-image-section">
        <div className="profile-image-wrapper-main">
          {profileImageUrl || user?.profilePicture ? (
            <img
              src={profileImageUrl || user?.profilePicture}
              alt="Profile"
              className="profile-image-main"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/100x100/505050/FFFFFF?text=User'; 
              }}
            />
          ) : (
            <div className="profile-placeholder-main">
              <LucideUser size={40} className="placeholder-icon-main" />
            </div>
          )}
        </div>
      </div>
      <div className="profile-info-main">
        <div className="profile-detail-row">
          <span className="detail-label-main">Name:</span>
          <span className="detail-value-main">{user?.name || 'Not set'}</span>
        </div>
        <div className="profile-detail-row">
          <span className="detail-label-main">Age:</span>
          <span className="detail-value-main">{user?.age || 'Not set'}</span>
        </div>
        <div className="profile-detail-row">
          <span className="detail-label-main">Sex:</span>
          <span className="detail-value-main">{user?.sex || 'Not set'}</span>
        </div>
        <div className="profile-detail-row">
          <span className="detail-label-main">Mental Score:</span>
          <span className="detail-value-main mental-score-highlight">{user?.mentalScore || 72}</span>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileCard;
