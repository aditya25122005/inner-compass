import React, { useState } from 'react';
import { LucideFileText, LucideDownload, LucideCalendar, LucideBarChart3, LucideEye } from 'lucide-react';

const MedicalReports = ({ user }) => {
  const [reports] = useState([
    {
      id: 1,
      title: 'Mental Health Assessment',
      date: '2025-08-28',
      type: 'Monthly',
      status: 'Complete',
      score: user?.mentalScore || 85,
      insights: ['Mood stability improved', 'Stress levels decreased', 'Sleep quality excellent']
    },
    {
      id: 2,
      title: 'Wellness Progress Report',
      date: '2025-08-21',
      type: 'Weekly',
      status: 'Complete',
      score: 78,
      insights: ['Exercise routine consistent', 'Meditation practice growing', 'Social connections strong']
    },
    {
      id: 3,
      title: 'Quarterly Analysis',
      date: '2025-06-30',
      type: 'Quarterly',
      status: 'Complete',
      score: 82,
      insights: ['Significant improvement in anxiety', 'Better coping strategies', 'Work-life balance enhanced']
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);

  const handleDownloadReport = (report) => {
    // Simulate report download
    const reportContent = `
Mental Health Report - ${report.title}
Generated: ${report.date}
Score: ${report.score}/100

Key Insights:
${report.insights.map(insight => `• ${insight}`).join('\n')}

Recommendations:
• Continue current wellness practices
• Focus on stress management techniques
• Maintain regular exercise routine
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_${report.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const closeReportModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="card medical-reports-card">
      <div className="card-header">
        <h2 className="card-title">
          <LucideFileText size={20} className="card-icon" />
          Medical Reports
        </h2>
        <p className="card-subtitle">Your health analysis reports</p>
      </div>
      
      <div className="reports-list">
        {reports.map((report) => (
          <div key={report.id} className="report-item">
            <div className="report-info">
              <div className="report-header">
                <h3 className="report-title">{report.title}</h3>
                <span className={`report-status ${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
              </div>
              <div className="report-details">
                <span className="report-date">
                  <LucideCalendar size={14} />
                  {new Date(report.date).toLocaleDateString()}
                </span>
                <span className="report-type">{report.type}</span>
                <span className="report-score">
                  <LucideBarChart3 size={14} />
                  Score: {report.score}/100
                </span>
              </div>
            </div>
            <div className="report-actions">
              <button 
                onClick={() => handleViewReport(report)}
                className="report-action-btn view-btn"
                title="View Report"
              >
                <LucideEye size={16} />
              </button>
              <button 
                onClick={() => handleDownloadReport(report)}
                className="report-action-btn download-btn"
                title="Download Report"
              >
                <LucideDownload size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="report-modal-overlay" onClick={closeReportModal}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <h3>{selectedReport.title}</h3>
              <button onClick={closeReportModal} className="modal-close-btn">×</button>
            </div>
            <div className="report-modal-content">
              <div className="report-meta">
                <p><strong>Date:</strong> {new Date(selectedReport.date).toLocaleDateString()}</p>
                <p><strong>Type:</strong> {selectedReport.type}</p>
                <p><strong>Score:</strong> {selectedReport.score}/100</p>
              </div>
              <div className="report-insights">
                <h4>Key Insights:</h4>
                <ul>
                  {selectedReport.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
              <div className="report-recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  <li>Continue current wellness practices</li>
                  <li>Focus on stress management techniques</li>
                  <li>Maintain regular exercise routine</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;
