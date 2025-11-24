import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate personalized wellness tasks based on user's mental health analysis
 * @param {Object} userAnalysis - User's recent mental health data
 * @returns {Array} Array of 4 personalized tasks
 */
export const generateWellnessTasks = async (userAnalysis) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are a mental health AI assistant. Based on the user's current mental state, generate exactly 4 personalized wellness tasks that can help improve their mental health score.

User Analysis:
- Current Mental Health Score: ${userAnalysis.mentalScore}/100
- Recent Mood: ${userAnalysis.latestMood}
- Recent Journal Entries: ${JSON.stringify(userAnalysis.recentJournals?.slice(0, 3) || [])}
- Compliance Rate: ${userAnalysis.complianceRate}%

Guidelines:
1. Tasks should be specific, actionable, and achievable within 24 hours
2. Mix different categories: Wellness, Mindfulness, Activity, Social, Sleep, Nutrition
3. Tasks should directly address the user's current mental health concerns
4. Make tasks realistic and not overwhelming
5. Prioritize based on urgency (high/medium/low)

Return ONLY a valid JSON array with exactly 4 tasks in this format:
[
  {
    "title": "Task title (max 60 characters)",
    "description": "Brief description of why this helps (max 150 characters)",
    "category": "Wellness|Mindfulness|Activity|Social|Sleep|Nutrition",
    "priority": "high|medium|low"
  }
]

Do not include any markdown, explanation, or text outside the JSON array.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim();

        // Parse JSON response
        let tasks;
        try {
            // Remove markdown code blocks if present
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            tasks = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            throw new Error('Invalid JSON response from AI');
        }

        // Validate tasks
        if (!Array.isArray(tasks) || tasks.length !== 4) {
            throw new Error('AI did not return exactly 4 tasks');
        }

        // Validate each task structure
        tasks.forEach((task, index) => {
            if (!task.title || !task.category || !task.priority) {
                throw new Error(`Task ${index + 1} is missing required fields`);
            }
        });

        return tasks;

    } catch (error) {
        console.error('Error generating wellness tasks:', error);
        // Return fallback tasks based on mental score
        return getFallbackTasks(userAnalysis.mentalScore, userAnalysis.latestMood);
    }
};

/**
 * Fallback tasks when AI generation fails
 */
const getFallbackTasks = (mentalScore, mood) => {
    const lowScoreTasks = [
        {
            title: "Practice 5-minute deep breathing exercise",
            description: "Helps reduce anxiety and center your thoughts",
            category: "Mindfulness",
            priority: "high"
        },
        {
            title: "Take a 15-minute walk outdoors",
            description: "Physical activity boosts mood and reduces stress",
            category: "Activity",
            priority: "high"
        },
        {
            title: "Write down 3 things you're grateful for",
            description: "Gratitude practice improves overall mental wellbeing",
            category: "Wellness",
            priority: "medium"
        },
        {
            title: "Reach out to a friend or family member",
            description: "Social connection is vital for mental health",
            category: "Social",
            priority: "medium"
        }
    ];

    const moderateTasks = [
        {
            title: "Practice 10-minute meditation or mindfulness",
            description: "Maintains mental clarity and emotional balance",
            category: "Mindfulness",
            priority: "medium"
        },
        {
            title: "Engage in 20 minutes of physical exercise",
            description: "Regular activity sustains good mental health",
            category: "Activity",
            priority: "medium"
        },
        {
            title: "Maintain consistent sleep schedule (8 hours)",
            description: "Quality sleep is essential for mental wellness",
            category: "Sleep",
            priority: "high"
        },
        {
            title: "Eat a balanced, nutritious meal",
            description: "Proper nutrition supports mental health",
            category: "Nutrition",
            priority: "low"
        }
    ];

    const highScoreTasks = [
        {
            title: "Continue daily mindfulness practice",
            description: "Maintain your excellent mental wellness routine",
            category: "Mindfulness",
            priority: "low"
        },
        {
            title: "Share your wellness journey with someone",
            description: "Your positive energy can inspire others",
            category: "Social",
            priority: "low"
        },
        {
            title: "Try a new relaxing hobby or activity",
            description: "Expand your wellness practices",
            category: "Activity",
            priority: "low"
        },
        {
            title: "Journal about your positive experiences today",
            description: "Reflecting on positivity reinforces good mental health",
            category: "Wellness",
            priority: "low"
        }
    ];

    if (mentalScore < 40) return lowScoreTasks;
    if (mentalScore < 70) return moderateTasks;
    return highScoreTasks;
};

/**
 * Calculate mental health score using Gemini AI analysis
 * @param {Object} userData - User's recent activity data
 * @returns {Number} Calculated mental health score (0-100)
 */
export const calculateMentalHealthScore = async (userData) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are a mental health analysis AI. Calculate an accurate mental health score (0-100) based on the user's recent data.

User Data:
- Recent Journal Entries (last 7): ${JSON.stringify(userData.journals || [])}
- Task Completion Rate: ${userData.taskCompletionRate}%
- Recent Moods: ${JSON.stringify(userData.recentMoods || [])}
- Chatbot Interactions: ${userData.chatbotInteractions || 0}
- Days Since Last Journal: ${userData.daysSinceLastJournal || 0}

Scoring Guidelines:
- Journal sentiment analysis: 40% weight
  - Positive sentiments (0.6-1.0): Higher score
  - Neutral sentiments (0.4-0.6): Moderate score
  - Negative sentiments (0.0-0.4): Lower score
  
- Task compliance: 30% weight
  - 80-100%: Excellent (add 25-30 points)
  - 60-79%: Good (add 18-24 points)
  - 40-59%: Fair (add 12-17 points)
  - 0-39%: Poor (add 0-11 points)

- Consistency: 20% weight
  - Regular journaling: +20 points
  - Irregular activity: +10 points
  - No recent activity: 0 points

- Mood trends: 10% weight
  - Improving moods: +10 points
  - Stable moods: +5 points
  - Declining moods: 0 points

Return ONLY a JSON object with this exact format:
{
  "score": 75,
  "reasoning": "Brief explanation of the score (max 200 characters)",
  "confidence": "high|medium|low"
}

Do not include any markdown, explanation, or text outside the JSON object.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim();

        // Parse JSON response
        let analysis;
        try {
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysis = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('Failed to parse Gemini score response:', text);
            throw new Error('Invalid JSON response from AI');
        }

        // Validate score
        if (typeof analysis.score !== 'number' || analysis.score < 0 || analysis.score > 100) {
            throw new Error('Invalid score from AI');
        }

        return {
            score: Math.round(analysis.score),
            reasoning: analysis.reasoning || 'Score calculated based on recent activity',
            confidence: analysis.confidence || 'medium'
        };

    } catch (error) {
        console.error('Error calculating mental health score with AI:', error);
        // Fallback to simple calculation
        return calculateFallbackScore(userData);
    }
};

/**
 * Fallback score calculation when AI fails
 */
const calculateFallbackScore = (userData) => {
    let score = 50; // Base score

    // Journal sentiment analysis (40% weight)
    if (userData.journals && userData.journals.length > 0) {
        const sentiments = userData.journals
            .map(j => parseFloat(j.analysis?.sentimentScore || 0.5))
            .filter(s => !isNaN(s));
        
        if (sentiments.length > 0) {
            const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
            score = avgSentiment * 40; // Convert to 0-40 range
        }
    }

    // Task compliance (30% weight)
    const taskScore = (userData.taskCompletionRate || 0) * 0.3;
    score += taskScore;

    // Consistency (20% weight)
    if (userData.daysSinceLastJournal === 0) {
        score += 20;
    } else if (userData.daysSinceLastJournal <= 2) {
        score += 15;
    } else if (userData.daysSinceLastJournal <= 5) {
        score += 10;
    } else if (userData.daysSinceLastJournal <= 7) {
        score += 5;
    }

    // Mood trends (10% weight)
    if (userData.recentMoods && userData.recentMoods.length >= 2) {
        const positiveMoods = ['happy', 'excited', 'calm', 'content'];
        const recentPositive = userData.recentMoods
            .slice(0, 3)
            .filter(m => positiveMoods.includes(m.toLowerCase())).length;
        
        score += (recentPositive / 3) * 10;
    }

    return {
        score: Math.min(100, Math.max(0, Math.round(score))),
        reasoning: 'Calculated from journal sentiment, task compliance, and activity consistency',
        confidence: 'medium'
    };
};

export default {
    generateWellnessTasks,
    calculateMentalHealthScore
};
