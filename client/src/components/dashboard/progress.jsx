import React from 'react';

const ProgressCard = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-300 mb-6">Progress</h2>
    <div className="flex flex-col space-y-6">
      <div className="progress-item">
        <p className="progress-item-label">Mood</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '85%' }}></div>
        </div>
      </div>
      <div className="progress-item">
        <p className="progress-item-label">Growth</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '70%' }}></div>
        </div>
      </div>
      <div className="progress-item">
        <p className="progress-item-label">Compliance</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default ProgressCard;