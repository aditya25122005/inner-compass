import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from "react-router-dom";
// CSS Styles as JavaScript objects for better component isolation
const styles = {
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    lineHeight: 1.6
  },
  
  sidebar: {
    width: '400px',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e2e8f0',
    position: 'relative',
    overflowY: 'auto'
  },
  
  sidebarBefore: {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2563eb, #3b82f6, #06b6d4)',
    zIndex: 1
  },
  
  logo: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '2rem',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center'
  },
  
  logoIcon: {
    marginRight: '0.75rem',
    color: '#2563eb'
  },
  
  profileCard: {
    background: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #e2e8f0',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  
  profileCardBefore: {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.1))',
    borderRadius: '1rem 1rem 0 0'
  },
  
  profilePic: {
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    border: '4px solid #ffffff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    marginBottom: '1rem',
    position: 'relative',
    zIndex: 2,
    objectFit: 'cover'
  },
  
  profileName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  
  profileStatus: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '1rem'
  },
  
  profileStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    textAlign: 'center'
  },
  
  statItem: {
    background: '#f8fafc',
    padding: '0.75rem',
    borderRadius: '0.5rem'
  },
  
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2563eb'
  },
  
  statLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: 500
  },
  
  reportsSection: {
    background: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    border: '1px solid #e2e8f0'
  },
  
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  
  sectionTitleIcon: {
    marginRight: '0.5rem',
    color: '#2563eb'
  },
  
  sectionSubtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    marginTop: '-0.5rem'
  },
  
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto'
  },
  
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    background: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    border: '1px solid #e2e8f0',
    marginBottom: '2rem'
  },
  
  welcomeTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  
  welcomeText: {
    fontSize: '1rem',
    color: '#64748b'
  },
  
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  settingsLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: 500,
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  
  settingsLinkHover: {
    background: '#2563eb',
    color: 'white',
    borderColor: '#2563eb',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #2563eb',
    objectFit: 'cover'
  },
  
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  
  dashboardSection: {
    background: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease'
  },
  
  dashboardSectionHover: {
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  
  sectionHeading: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  
  sectionHeadingIcon: {
    marginRight: '0.75rem',
    color: '#2563eb'
  }
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationStyle = (type) => ({
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    color: 'white',
    fontWeight: 500,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: type === 'success' ? 'linear-gradient(135deg, #059669, #10b981)' :
               type === 'error' ? 'linear-gradient(135deg, #dc2626, #ef4444)' :
               type === 'warning' ? 'linear-gradient(135deg, #d97706, #f59e0b)' :
               'linear-gradient(135deg, #2563eb, #3b82f6)'
  });

  return (
    <div style={getNotificationStyle(type)}>
      <span>{message}</span>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ user }) => {
  return (
    <div style={styles.profileCard}>
      <div style={styles.profileCardBefore}></div>
      <img 
        src="https://media.licdn.com/dms/image/v2/D5603AQGN1CX_mqgqSA/profile-displayphoto-crop_800_800/B56Zi3yW.DG0AI-/0/1755430091583?e=1759968000&v=beta&t=7fUvkSE9K0_u2bxIQ--FXzeeO9TK6zpGp0l7Jf2rleg" 
        alt="User Profile" 
        style={styles.profilePic}
      />
      <div style={styles.profileName}>{user.name}</div>
      <div style={styles.profileStatus}>Wellness Journey in Progress</div>
      <div style={styles.profileStats}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>72</div>
          <div style={styles.statLabel}>Mental Score</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statValue}>{user.age}</div>
          <div style={styles.statLabel}>Age</div>
        </div>
      </div>
    </div>
  );
};

// Report Card Component
const ReportCard = ({ report, onView, onDownload }) => {
  const reportCardStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease'
  };

  const statusBadgeStyle = {
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: 'rgba(5, 150, 105, 0.1)',
    color: '#059669'
  };

  const actionBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#64748b',
    padding: '0.25rem',
    borderRadius: '0.375rem',
    transition: 'all 0.3s ease',
    marginLeft: '0.5rem'
  };

  return (
    <div style={reportCardStyle}>
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
          {report.title}
        </h4>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0' }}>
          {report.date} • {report.frequency}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.125rem 0' }}>
          Score: {report.score}/100
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={statusBadgeStyle}>Complete</span>
        <button style={actionBtnStyle} onClick={() => onView(report.id)}>
          👁️
        </button>
        <button style={actionBtnStyle} onClick={() => onDownload(report.id)}>
          📥
        </button>
      </div>
    </div>
  );
};

// Reports Section Component
const ReportsSection = ({ reports, onViewReport, onDownloadReport }) => {
  return (
    <div style={styles.reportsSection}>
      <h3 style={styles.sectionTitle}>
        <span style={styles.sectionTitleIcon}>📊</span>
        Medical Reports
      </h3>
      <p style={styles.sectionSubtitle}>Your health analysis reports</p>
      
      {reports.map(report => (
        <ReportCard 
          key={report.id}
          report={report}
          onView={onViewReport}
          onDownload={onDownloadReport}
        />
      ))}
    </div>
  );
};

// Problem Catch Component
const ProblemCatch = () => {
  const vennDiagramStyle = {
    position: 'relative',
    width: '250px',
    height: '200px',
    margin: '0 auto'
  };

  const vennCircleStyle = {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    opacity: 0.3
  };

  const avatarStyle = {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '3px solid #ffffff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    objectFit: 'cover'
  };

  const centerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    background: '#ffffff',
    borderRadius: '50%',
    border: '2px solid #2563eb',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    color: '#2563eb'
  };

  return (
    <div style={vennDiagramStyle}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{
          ...vennCircleStyle,
          background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
          top: '20px',
          left: '65px'
        }}></div>
        <div style={{
          ...vennCircleStyle,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          bottom: '20px',
          left: '20px'
        }}></div>
        <div style={{
          ...vennCircleStyle,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          bottom: '20px',
          right: '20px'
        }}></div>
      </div>
      
      <img 
        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=60&h=60&fit=crop" 
        style={{ ...avatarStyle, top: '10px', left: '50%', transform: 'translateX(-50%)' }}
        alt="Stress"
      />
      <img 
        src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=60&h=60&fit=crop" 
        style={{ ...avatarStyle, bottom: '10px', left: '15px' }}
        alt="Sleep"
      />
      <img 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
        style={{ ...avatarStyle, bottom: '10px', right: '15px' }}
        alt="Happiness"
      />
      
      <div style={centerStyle}>
        ❤️
      </div>
    </div>
  );
};

// Week Plan Component
const WeekPlan = ({ weekPlan }) => {
  const weekPlanGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.75rem',
    marginTop: '1rem'
  };

  const weekDayStyle = {
    fontWeight: 600,
    color: '#64748b',
    textAlign: 'center',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const weekItemStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '0.75rem 0.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#1e293b',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  return (
    <div style={weekPlanGridStyle}>
      {weekPlan.days.map(day => (
        <div key={day} style={weekDayStyle}>{day}</div>
      ))}
      {weekPlan.activities.map((activity, index) => (
        <div 
          key={index} 
          style={weekItemStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(37, 99, 235, 0.1)';
            e.target.style.borderColor = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#f8fafc';
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {activity}
        </div>
      ))}
    </div>
  );
};

// Activity Chart Component
const ActivityChart = ({ data }) => {
  const chartStyle = {
    position: 'relative',
    height: '300px'
  };

  return (
    <div style={chartStyle}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontWeight: 500 }}
          />
          <YAxis 
            domain={[40, 90]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontWeight: 500 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#ffffff',
              border: '1px solid #2563eb',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
            fill="rgba(37, 99, 235, 0.1)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Mental Gauge Component
const MentalGauge = ({ score }) => {
  const gaugeContainerStyle = {
    position: 'relative',
    width: '150px',
    height: '150px',
    margin: '1rem auto'
  };

  const gaugeRingStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(
      from -90deg,
      #2563eb 0%,
      #3b82f6 35%,
      #06b6d4 50%,
      #10b981 ${score * 0.72}%,
      #e2e8f0 ${score * 0.72}%
    )`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const gaugeCenterStyle = {
    background: '#ffffff',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  };

  const gaugeScoreStyle = {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1e293b'
  };

  const gaugeLabelStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: 500,
    marginTop: '0.25rem'
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={gaugeContainerStyle}>
        <div style={gaugeRingStyle}>
          <div style={gaugeCenterStyle}>
            <div style={gaugeScoreStyle}>{score}</div>
            <div style={gaugeLabelStyle}>Balanced</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, value }) => {
  const progressItemStyle = {
    marginBottom: '1.5rem'
  };

  const progressHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  };

  const progressLabelStyle = {
    fontWeight: 500,
    color: '#1e293b'
  };

  const progressValueStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#2563eb'
  };

  const progressBarStyle = {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '0.375rem',
    overflow: 'hidden'
  };

  const progressFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
    borderRadius: '0.375rem',
    width: `${value}%`,
    transition: 'width 1s ease-in-out'
  };

  return (
    <div style={progressItemStyle}>
      <div style={progressHeaderStyle}>
        <span style={progressLabelStyle}>{label}</span>
        <span style={progressValueStyle}>{value}%</span>
      </div>
      <div style={progressBarStyle}>
        <div style={progressFillStyle}></div>
      </div>
    </div>
  );
};

// Suggestion Card Component
const SuggestionCard = ({ title, description }) => {
  const suggestionCardStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    transition: 'all 0.3s ease'
  };

  const suggestionTitleStyle = {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    marginTop: '0.4rem'
  };

  const suggestionDescriptionStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    lineHeight: 1.5
  };

  return (
    <div 
      style={suggestionCardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#ffffff';
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f8fafc';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={suggestionTitleStyle}>{title}</div>
      <div style={suggestionDescriptionStyle}>{description}</div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [user, setUser] = useState({ name: 'Himanshu', age: 28 });
  const [notification, setNotification] = useState(null);
  
  const reports = [
    {
      id: 'mental-health',
      title: 'Mental Health Assessment',
      date: 'Aug 20, 2025',
      frequency: 'Monthly',
      score: 85
    },
    {
      id: 'wellness-progress',
      title: 'Wellness Progress Report',
      date: 'Sep 1, 2025',
      frequency: 'Weekly',
      score: 78
    },
    {
      id: 'quarterly',
      title: 'Quarterly Analysis',
      date: 'Jun 30, 2025',
      frequency: 'Quarterly',
      score: 88
    }
  ];

  const weekPlan = {
    days: ['Sat', 'Sun', 'Mon', 'Tue'],
    activities: ['Morning Walk', 'Meditation', 'Gym Session', 'Therapy', 'Reading Time', 'Family Call', 'Workout', 'Journaling']
  };

  const activityData = [
    { day: 'Sat', score: 50 },
    { day: 'Sun', score: 65 },
    { day: 'Mon', score: 55 },
    { day: 'Tue', score: 70 },
    { day: 'Wed', score: 60 },
    { day: 'Thu', score: 75 },
    { day: 'Fri', score: 80 }
  ];

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleViewReport = (reportId) => {
    showNotification(`Opening ${reportId} report...`, 'info');
  };

  const handleDownloadReport = (reportId) => {
    showNotification(`Downloading ${reportId} report...`, 'success');
  };

  const handleSettings = () => {
    showNotification('Navigating to settings...', 'info');
  };

  return (
    <div style={styles.dashboard}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBefore}></div>
        
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🧭</span>
          Inner Compass
        </div>
        
        <ProfileCard user={user} />
        
        <ReportsSection 
          reports={reports}
          onViewReport={handleViewReport}
          onDownloadReport={handleDownloadReport}
        />
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.topHeader}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {user.name}!</h1>
            <p style={styles.welcomeText}>Here's your wellness overview for today</p>
          </div>
          <div style={styles.headerActions}>
          

<div 
  style={styles.settingsLink}
  onMouseEnter={(e) => {
    Object.assign(e.target.style, styles.settingsLinkHover);
  }}
  onMouseLeave={(e) => {
    Object.assign(e.target.style, styles.settingsLink);
  }}
>
  <Link to="/settings" style={{ textDecoration: "none", color: "inherit" }}>
    ⚙️ Settings
  </Link>
</div>

            
          </div>
        </header>

        {/* Dashboard Grid */}
        <div style={styles.dashboardGrid}>
          {/* Center Column */}
          <div style={styles.column}>
            {/* Problem Catch */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.sectionHeading}>
                <span style={styles.sectionHeadingIcon}>👥</span>
                Problem Catch
              </h3>
              <ProblemCatch />
            </section>

            {/* Week Plan */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.sectionHeading}>
                <span style={styles.sectionHeadingIcon}>📅</span>
                Week Plan
              </h3>
              <WeekPlan weekPlan={weekPlan} />
            </section>

            {/* Activity Overview */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.sectionHeading}>
                <span style={styles.sectionHeadingIcon}>📈</span>
                Activity Overview
              </h3>
              <ActivityChart data={activityData} />
            </section>
          </div>

          {/* Right Column */}
          <div style={styles.column}>
            {/* Mental Status */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.sectionHeading}>
                <span style={styles.sectionHeadingIcon}>🧠</span>
                Mental Status
              </h3>
              <MentalGauge score={72} />
            </section>

            {/* Progress Tracking */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.sectionHeading}>
                <span style={styles.sectionHeadingIcon}>📊</span>
                Progress Tracking
              </h3>
              <ProgressBar label="Mood" value={80} />
              <ProgressBar label="Growth" value={70} />
              <ProgressBar label="Compliance" value={60} />
            </section>

            {/* Today's Suggestions */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.sectionHeading}>
                <span style={styles.sectionHeadingIcon}>💡</span>
                Today's Suggestions
              </h3>
              <SuggestionCard 
                title="Try Deep Breathing"
                description="Take deep breaths when feeling overwhelmed to reduce stress and improve focus."
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;