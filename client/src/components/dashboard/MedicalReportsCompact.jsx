import React, { useState } from 'react';
import { LucideFileText, LucideDownload, LucideCalendar, LucideBarChart3, LucideEye, LucidePlus } from 'lucide-react';

const MedicalReportsCompact = ({ user }) => {
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

  const handleDownloadReport = (report, e) => {
    e.stopPropagation();
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

  const handleViewReport = (report, e) => {
    e.stopPropagation();
    setSelectedReport(report);
  };

  const closeReportModal = () => {
    setSelectedReport(null);
  };

  const generateNewReport = () => {
    // Simulate generating a new report
    console.log('Generating new medical report...');
  };

  return (
    <div className="medical-reports-compact">
      <div className="compact-header">
        <h3 className="compact-title">
          <LucideFileText size={18} className="title-icon" />
          Medical Reports
        </h3>
        <button 
          onClick={generateNewReport}
          className="generate-report-btn"
          title="Generate New Report"
        >
          <LucidePlus size={16} />
        </button>
      </div>
      
      <div className="compact-reports-list">
        {reports.slice(0, 3).map((report) => (
          <div key={report.id} className="compact-report-item">
            <div className="compact-report-info">
              <h4 className="compact-report-title">{report.title}</h4>
              <div className="compact-report-meta">
                <span className="compact-date">
                  <LucideCalendar size={12} />
                  {new Date(report.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="compact-score">
                  <LucideBarChart3 size={12} />
                  {report.score}
                </span>
              </div>
            </div>
            <div className="compact-actions">
              <button 
                onClick={(e) => handleViewReport(report, e)}
                className="compact-action-btn view"
                title="View Report"
              >
                <LucideEye size={12} />
              </button>
              <button 
                onClick={(e) => handleDownloadReport(report, e)}
                className="compact-action-btn download"
                title="Download Report"
              >
                <LucideDownload size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="reports-summary">
        <div className="summary-item">
          <span className="summary-label">Total Reports:</span>
          <span className="summary-value">{reports.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg Score:</span>
          <span className="summary-value">
            {Math.round(reports.reduce((acc, report) => acc + report.score, 0) / reports.length)}
          </span>
        </div>
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

export default MedicalReportsCompact;
