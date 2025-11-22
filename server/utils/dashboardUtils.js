/**
 * Utility functions for calculating dashboard metrics.
 */

// Helper to determine if a date object is today (assuming date is an ISO string or Date object)
const isToday = (dateString) => {
    const today = new Date();
    const target = new Date(dateString);
    if (isNaN(target)) return false; // Handle invalid dates

    return target.getDate() === today.getDate() &&
        target.getMonth() === today.getMonth() &&
        target.getFullYear() === today.getFullYear();
}

/**
 * Calculates a Weighted Moving Average (WMA) for emotional stability over recent entries.
 * Gives higher weight to newer data for a stable yet responsive Mental Status Score.
 * @param {Array} entries - The journal entries, sorted newest first.
 * @param {number} period - Number of recent entries to consider for WMA (e.g., 7).
 * @returns {number} The stabilized Mental Status Score (0-100).
 */
const calculateWMA = (entries, period = 7) => {
    if (entries.length === 0) return 50;

    const relevantEntries = entries.slice(0, period);
    let weightedSum = 0;
    let totalWeight = 0;

    // Weights are assigned linearly: newest entry (i=0) gets weight 'period', next (i=1) gets 'period-1', etc.
    for (let i = 0; i < relevantEntries.length; i++) {
        const weight = period - i; 
        
        // Use the inverse stress level (Mental Score): 100 - stressLevel
        // Default to 50 if stressLevel is missing to prevent errors
        const stressLevel = relevantEntries[i].analysis?.stressLevel ?? 50;
        const mentalScore = 100 - stressLevel;

        weightedSum += mentalScore * weight;
        totalWeight += weight;
    }

    if (totalWeight === 0) return 50;

    let finalScore = weightedSum / totalWeight;

    // Clamp the final score (0-100)
    finalScore = Math.max(0, Math.min(100, finalScore));

    // For better initial stability (especially for mini-projects), keep the score higher initially
    if (entries.length < 5) {
        // If there are very few entries, ensure the score doesn't crash too low too fast.
        return Math.round(Math.max(50, finalScore)); 
    }
    
    return Math.round(finalScore);
}


export const calculateMetrics = (journalEntries, tasks) => {

    if (journalEntries.length === 0) {
        return {
            mentalScore: 50,
            complianceRate: 100,
            totalEntries: 0,
            latestJournalMood: "neutral",
            weeklyActivityData: []
        };
    }

    // 1) Mental Score (FIXED: Use WMA for stable overall score)
    const mentalScore = calculateWMA(journalEntries, 7); // Uses the last 7 entries (weighted)

    // 2) Compliance Rate (FIXED: Filter tasks for TODAY)
    // NOTE: Requires tasks to have a timestamp (e.g., dateAdded) which should come from Firestore
    // We assume tasks passed here are ALL active/suggested tasks.
    const tasksToday = tasks.filter(t => isToday(t.dateAdded || t.createdAt)); // Assuming a date field exists

    const tasksCompletedToday = tasksToday.filter(t => t.isCompleted).length;
    const totalTasksToday = tasksToday.length;

    const complianceRate = totalTasksToday > 0
        ? Math.round((tasksCompletedToday / totalTasksToday) * 100)
        : 100; // If no tasks assigned today, compliance is 100%

    // 3) Weekly Trend (FIXED: Populate the last 4 weeks with representative data)
    // We simulate weekly scores using the WMA on different data slices for a more realistic trend display
    
    // Wk 4 (Current Score - most recent WMA)
    const wk4Score = mentalScore; 
    
    // Wk 3 (Slightly older WMA)
    const wk3Score = calculateWMA(journalEntries.slice(7), 7);
    
    // Wk 2 (Older WMA)
    const wk2Score = calculateWMA(journalEntries.slice(14), 7);
    
    // Wk 1 (Oldest WMA, used for initial bar)
    const wk1Score = calculateWMA(journalEntries.slice(21), 7);
    
    // Fallback logic to ensure some bars exist if not enough data
    const safeScore = (score) => Math.max(50, Math.min(90, score));

    const weeklyActivityData = [
        { week: "Wk 1", score: safeScore(wk1Score) },
        { week: "Wk 2", score: safeScore(wk2Score) },
        { week: "Wk 3", score: safeScore(wk3Score) },
        { week: "Wk 4", score: wk4Score } // Show actual current score for the final week
    ];

    const latest = journalEntries[0].analysis;

    return {
        mentalScore,
        complianceRate,
        totalEntries: journalEntries.length,
        // Ensure you use the 'mood' property set during journaling, or fallback to AI emotion
        latestJournalMood: journalEntries[0]?.mood || latest.emotion || "neutral", 
        weeklyActivityData
    };
};