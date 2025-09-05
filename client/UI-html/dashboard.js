// Global variables
let activityChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    animateProgressBars();
    loadUserData();
});

// Initialize activity chart
function initializeChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (activityChart) {
        activityChart.destroy();
    }

    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Activity Score',
                data: [50, 65, 55, 70, 60, 75, 80],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `Activity Score: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            weight: '500'
                        }
                    }
                },
                y: {
                    min: 40,
                    max: 90,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            weight: '500'
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 300 + (index * 200));
    });
}

// Load user data - using in-memory storage instead of localStorage
let userProfileData = {
    name: 'Sunny',
    age: 28
};

function loadUserData() {
    if (userProfileData.name) {
        const welcomeTitle = document.querySelector('.welcome-section h1');
        if (welcomeTitle) {
            welcomeTitle.textContent = `Welcome back, ${userProfileData.name}!`;
        }
        
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.textContent = userProfileData.name;
        }
    }

    if (userProfileData.age) {
        const ageElement = document.querySelector('.stat-item:last-child .stat-value');
        if (ageElement) {
            ageElement.textContent = userProfileData.age;
        }
    }
}

// Report actions
function viewReport(reportId) {
    showNotification(`Opening ${reportId} report...`, 'info');
    // In a real application, this would open the report in a modal or new page
    console.log(`Viewing report: ${reportId}`);
}

function downloadReport(reportId) {
    showNotification(`Downloading ${reportId} report...`, 'success');
    // Simulate download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,Sample Report Data';
        link.download = `${reportId}-report.txt`;
        link.click();
    }, 1000);
}

// Navigation
function goToSettings() {
    showNotification('Navigating to settings...', 'info');
    // In a real application, this would navigate to the settings page
    console.log('Navigate to settings page');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        color: white;
        font-weight: 500;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    const iconMap = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    const colorMap = {
        'success': 'linear-gradient(135deg, #059669, #10b981)',
        'error': 'linear-gradient(135deg, #dc2626, #ef4444)',
        'warning': 'linear-gradient(135deg, #d97706, #f59e0b)',
        'info': 'linear-gradient(135deg, #2563eb, #3b82f6)'
    };
    
    notification.style.background = colorMap[type];
    notification.innerHTML = `
        <i class="${iconMap[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Update mental status gauge based on dynamic score
function updateMentalGauge(score) {
    const gaugeScore = document.querySelector('.gauge-score');
    const gaugeRing = document.querySelector('.gauge-ring');
    
    if (gaugeScore) {
        gaugeScore.textContent = score;
    }
    
    if (gaugeRing) {
        const percentage = score / 100;
        const stopPoint = percentage * 360;
        
        gaugeRing.style.background = `conic-gradient(
            from -90deg,
            #2563eb 0%,
            #3b82f6 ${stopPoint * 0.4}deg,
            #06b6d4 ${stopPoint * 0.6}deg,
            #10b981 ${stopPoint}deg,
            #e2e8f0 ${stopPoint}deg
        )`;
    }
}

// Refresh dashboard data
function refreshDashboard() {
    showNotification('Refreshing dashboard...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        // Update some random values for demo
        const newScore = Math.floor(Math.random() * 40) + 60;
        updateMentalGauge(newScore);
        
        // Update chart with new data
        if (activityChart) {
            const newData = activityChart.data.datasets[0].data.map(() => 
                Math.floor(Math.random() * 30) + 50
            );
            activityChart.data.datasets[0].data = newData;
            activityChart.update();
        }
        
        showNotification('Dashboard updated successfully!', 'success');
    }, 2000);
}

// Update user profile data
function updateUserProfile(name, age) {
    userProfileData.name = name;
    userProfileData.age = age;
    loadUserData();
}

// Get current user data
function getUserData() {
    return userProfileData;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+R to refresh dashboard
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
    
    // Ctrl+S to go to settings
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        goToSettings();
    }
});

// Auto-refresh data every 5 minutes
setInterval(() => {
    refreshDashboard();
}, 300000);

// Handle window resize
window.addEventListener('resize', function() {
    if (activityChart) {
        activityChart.resize();
    }
});

function goToSettings(){
    window.location.href = 'settings.html';
}
