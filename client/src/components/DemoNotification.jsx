import React, { useState, useEffect } from 'react';
import { LucideInfo, LucideX } from 'lucide-react';

const DemoNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user is logged in with demo token
    const token = localStorage.getItem('token');
    const dismissed = localStorage.getItem('demo-notification-dismissed');
    
    if (token === 'demo-token-123456' && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('demo-notification-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="demo-notification">
      <div className="demo-notification-content">
        <LucideInfo className="demo-notification-icon" size={20} />
        <div className="demo-notification-text">
          <strong>Demo Mode Active</strong>
          <p>You're using the demo version. Backend server is not connected.</p>
        </div>
        <button 
          onClick={handleDismiss}
          className="demo-notification-close"
          aria-label="Dismiss notification"
        >
          <LucideX size={16} />
        </button>
      </div>
    </div>
  );
};

export default DemoNotification;
