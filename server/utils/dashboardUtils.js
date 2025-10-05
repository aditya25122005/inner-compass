export const calculateMetrics = (journalEntries, tasks) => {

    const rawSentiment = journalEntries.length > 0 
        ? journalEntries[0].analysis.sentimentScore 
        : 0.5; 

    const latestSentimentScore = parseFloat(rawSentiment) || 0.5; 

   
    const mentalScore = Math.round(55 + (latestSentimentScore * 45)); 

    const tasksCompletedToday = tasks.filter(t => t.isCompleted).length;
    const totalTasks = tasks.length;

    const complianceRate = totalTasks > 0 
        ? Math.round((tasksCompletedToday / totalTasks) * 100) 
        : 100;

    return {
        mentalScore: mentalScore,
        complianceRate: complianceRate,
        totalEntries: journalEntries.length,
        latestJournalMood: journalEntries[0]?.mood || 'neutral',
        weeklyActivityData: [ 
            { week: 'Wk 1', score: 65 },
            { week: 'Wk 2', score: 70 },
            { week: 'Wk 3', score: mentalScore },
            { week: 'Wk 4', score: 80 }
        ]
    };
};