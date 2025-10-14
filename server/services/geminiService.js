import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

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
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    console.log(' Gemini AI service initialized successfully');
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
      const defaultSystemPrompt = `You are InnerCompass, a compassionate and supportive AI companion designed to help users with their emotional well-being and mental health journey. You provide:

1. Empathetic listening and emotional support
2. Practical coping strategies and mindfulness techniques
3. Mood tracking insights and reflection prompts
4. Gentle guidance for self-care and personal growth
5. Crisis support awareness (always recommend professional help for serious issues)

Keep responses warm, understanding, and conversational. Focus on the user's emotional needs while being supportive but not providing medical advice.`;

      const prompt = systemPrompt || defaultSystemPrompt;
      
      // Create the full conversation prompt
      const fullPrompt = conversationContext 
        ? `${prompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${userMessage}\n\nAssistant:`
        : `${prompt}\n\nUser: ${userMessage}\n\nAssistant:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      return text.trim();

    } catch (error) {
      console.error('Gemini API Error:', error.message);
      
      // Fallback responses when API fails
      const fallbackResponses = [
        "I'm having trouble connecting to my AI service right now, but I'm here to listen. Can you tell me more about how you're feeling?",
        "Sorry, I'm experiencing some technical difficulties. How are you feeling today? I'd love to support you.",
        "I'm not able to process that properly right now, but I care about your well-being. What's on your mind?",
        "There seems to be a connection issue on my end. Is there something specific you'd like to talk about regarding your mood or feelings?",
        "I'm having some technical troubles, but I'm still here for you. How can I support your emotional well-being today?"
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
