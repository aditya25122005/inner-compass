import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fallbackChatbot from './fallbackChatbot.js';

// Ensure dotenv is loaded
dotenv.config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.error(' GEMINI_API_KEY not found in environment variables');
      throw new Error('Gemini API key not configured in .env file');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    // Try different models - some API keys have different model access
    this.modelNames = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'];
    this.currentModelIndex = 0;
    this.initializeModel();
    
    console.log('✅ Gemini AI service initialized successfully');
  }

  initializeModel() {
    const modelName = this.modelNames[this.currentModelIndex];
    this.model = this.genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    this.currentModelName = modelName;
    console.log(`💡 Using model: ${modelName}`);
  }

  async tryNextModel() {
    if (this.currentModelIndex < this.modelNames.length - 1) {
      this.currentModelIndex++;
      this.initializeModel();
      return true;
    }
    return false;
  }

  async generateResponse(userMessage, context = [], systemPrompt = null) {
    try {
      // Prepare conversation history for context
      let conversationContext = '';
      if (context.length > 0) {
        conversationContext = context
          .slice(-5) // Last 5 messages for context
          .map(msg => `${msg.sender === 'bot' ? 'Assistant' : 'User'}: ${msg.message}`)
          .join('\n');
      }

      // Default system prompt for InnerCompass mood chatbot
      const defaultSystemPrompt = `You are InnerCompass, a friendly and supportive AI companion - like a caring friend who's always there to listen. Talk naturally and casually, like you're chatting with a friend over coffee. Use emojis when appropriate 😊

Your vibe:
- Warm, casual, and relatable (use "I feel you", "that sucks", "ugh", etc.)
- Empathetic but not overly formal or clinical
- Encouraging and supportive without being preachy
- Real talk - acknowledge when things are hard
- Use emojis to show emotion and connection 💜

What you do:
- Listen and validate feelings without judgment
- Share practical coping strategies in a friendly way
- Ask open-ended questions to understand better
- For serious issues, gently suggest professional help
- Keep it conversational - like texting a supportive friend

Keep responses natural and concise (2-4 sentences usually, longer when needed). Be authentic, warm, and human. Avoid clinical language - talk like a real friend would!`;

      const prompt = systemPrompt || defaultSystemPrompt;
      
      // Create the full conversation prompt
      const fullPrompt = conversationContext 
        ? `${prompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${userMessage}\n\nAssistant:`
        : `${prompt}\n\nUser: ${userMessage}\n\nAssistant:`;

      console.log(`📤 Sending request to Gemini API (${this.currentModelName})...`);
      
      // Try with retry logic for rate limits and model fallback
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const result = await this.model.generateContent(fullPrompt);
          const response = await result.response;
          const text = response.text();

          if (!text || text.trim() === '') {
            console.error('❌ Empty response from Gemini API');
            throw new Error('Empty response from Gemini API');
          }

          console.log(`✅ Received response from Gemini API (attempt ${attempt})`);
          return text.trim();
        } catch (err) {
          lastError = err;
          
          // Check if it's a rate limit error (429)
          if (err.status === 429 && attempt <= 2) {
            const waitTime = attempt * 3000; // 3s, 6s
            console.log(`⏳ Rate limit hit, waiting ${waitTime/1000}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          // Check if it's a model not found error (404)
          if (err.status === 404 && attempt === 1) {
            console.log(`⚠️  Model ${this.currentModelName} not available, trying alternative...`);
            if (await this.tryNextModel()) {
              continue; // Try again with new model
            }
          }
          
          // For other errors or final retry, break the loop
          break;
        }
      }
      
      // If we got here, all retries failed
      throw lastError;

    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      
      // Check if it's a rate limit error
      if (error.status === 429) {
        console.error('⚠️  Rate limit exceeded. The API quota has been exhausted.');
        console.error('💡 Solutions:');
        console.error('   1. Wait 20-60 seconds and try again');
        console.error('   2. Upgrade your API plan at https://ai.google.dev/pricing');
        console.error('   3. Use a different API key');
      } else if (error.status === 404) {
        console.error('⚠️  Model not found. This API key may not support the requested model.');
      } else {
        console.error('Error details:', error);
      }
      
      // Use intelligent fallback chatbot system
      console.log('💡 Using fallback chatbot for response');
      return fallbackChatbot.generateResponse(userMessage, context);
    }
  }

  async testConnection() {
    try {
      const response = await this.generateResponse("Hello, this is a test message. Please respond briefly.");
      return { success: true, response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Mood analysis specific method
  async analyzeMood(userMessage, previousMessages = []) {
    const moodPrompt = `You are InnerCompass, an AI mood analyzer. Analyze the user's emotional state from their message and provide:

1. Primary emotion detected (happy, sad, anxious, angry, neutral, mixed, etc.)
2. Intensity level (1-10)
3. Brief supportive response
4. Suggested coping strategy if needed

Keep your response structured but conversational.`;

    return await this.generateResponse(userMessage, previousMessages, moodPrompt);
  }

  // Journal reflection method
  async generateJournalPrompt(topic = null) {
    const journalPromptMessage = topic 
      ? `Create a thoughtful journal prompt about ${topic}` 
      : "Create a mindful journal prompt for self-reflection";

    const journalPrompt = `You are InnerCompass, providing meaningful journal prompts for self-reflection and emotional growth. Create a single, thoughtful prompt that encourages introspection and emotional awareness.`;

    return await this.generateResponse(journalPromptMessage, [], journalPrompt);
  }
}

export default new GeminiService();
