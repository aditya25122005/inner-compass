export const calculateMetrics = (journalEntries, tasks, user) => {
    // Use the actual mental health score from user profile (calculated by AI)
    const mentalScore = user?.mentalHealthScore || 50;

    // Calculate task compliance rate
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const totalTasks = tasks.length;
    const complianceRate = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

    // Calculate weekly activity data based on actual journal entries
    const weeklyActivityData = calculateWeeklyScores(journalEntries);

    // Get mood distribution
    const moodCounts = {};
    journalEntries.forEach(entry => {
        const mood = entry.mood || 'neutral';
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    return {
        mentalScore: mentalScore,
        complianceRate: complianceRate,
        totalEntries: journalEntries.length,
        totalTasks: totalTasks,
        completedTasks: completedTasks,
        latestJournalMood: journalEntries[0]?.mood || 'N/A',
        weeklyActivityData: weeklyActivityData,
        moodDistribution: moodCounts
    };
};

// Calculate weekly scores based on actual data
const calculateWeeklyScores = (journalEntries) => {
    const now = new Date();
    const weeks = [];
    
    // Calculate scores for last 4 weeks
    for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const weekEntries = journalEntries.filter(entry => {
            const entryDate = new Date(entry.createdAt);
            return entryDate >= weekStart && entryDate < weekEnd;
        });
        
        let weekScore = 50; // Default
        if (weekEntries.length > 0) {
            const sentiments = weekEntries
                .map(e => parseFloat(e.analysis?.sentimentScore || 0.5))
                .filter(s => !isNaN(s));
            
            if (sentiments.length > 0) {
                const avg = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
                weekScore = Math.round(avg * 100);
            }
        }
        
        weeks.push({
            week: `Week ${4 - i}`,
            score: weekScore,
            entries: weekEntries.length
        });
    }
    
    return weeks;
};