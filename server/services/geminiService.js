import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log("🔵 geminiService.js loaded");

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;

    if (!this.apiKey) {
      console.error("❌ GEMINI_API_KEY missing in .env");
      this.genAI = null;
      this.model = null;
      return;
    }

    // FINAL working model
    this.modelName = "models/gemini-2.5-flash";

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.modelName,
      });

      console.log(`✨ Gemini AI initialized: ${this.modelName}`);
    } catch (err) {
      console.error("❌ Gemini initialization failed:", err.message);
      this.genAI = null;
      this.model = null;
    }
  }

  formatContext(context = []) {
    return context.map((msg) => ({
      role: msg.sender === "bot" ? "model" : "user",
      parts: [{ text: msg.message }],
    }));
  }

  async generateResponse(message, context = [], systemPrompt = null) {
    if (!this.model) {
      return "AI service unavailable. Try again later.";
    }

    try {
      // Build the conversation messages
      const messages = [];

      // 🔥 Instead of role: "system", we prepend as a USER message
      if (systemPrompt) {
        messages.push({
          role: "user",
          parts: [{ text: systemPrompt }],
        });
      }

      messages.push(...this.formatContext(context));

      messages.push({
        role: "user",
        parts: [{ text: message }],
      });

      const result = await this.model.generateContent({
        contents: messages,
      });

      return result?.response?.text() || "I'm having trouble right now.";
    } catch (err) {
      console.error("Gemini Error:", err.message);
      return "I'm having technical trouble right now. Please try again.";
    }
  }

  // ---------- MOOD ANALYZER ----------
  async analyzeMood(message, context = []) {
    const systemPrompt = `
You are a mood analyzer.
ALWAYS respond ONLY in JSON:

{
  "emotion": "string",
  "intensity": 1-10,
  "advice": "string",
  "response": "string"
}
`;

    const raw = await this.generateResponse(message, context, systemPrompt);

    console.log("MOOD RAW RESULT:", raw);

    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON missing");

      return JSON.parse(match[0]);
    } catch (err) {
      console.log("⚠ JSON PARSE ERROR — returning fallback");
      return {
        emotion: "unknown",
        intensity: 0,
        advice: "I couldn't analyze your mood due to a technical issue.",
        response: raw,
      };
    }
  }

  // Journal prompt
async generateJournalPrompt(topic = null) {
  const system = `
You are a journal prompt generator AI.
Always return JSON in the following format ONLY:

{
  "topic": "string",
  "prompt": "string",
  "generatedAt": "ISO date string"
}

JSON only. No markdown. No explanations.
`;

  const userPrompt = topic
    ? `Give me a deep journal prompt about: ${topic}`
    : `Give me a meaningful self-reflection journal prompt.`;

  const raw = await this.generateResponse(userPrompt, [], system);

  console.log("RAW JOURNAL PROMPT:", raw);

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.log("⚠ JSON PARSE ERROR — returning fallback");
    return {
      topic: topic || "General",
      prompt: raw,
      generatedAt: new Date().toISOString(),
    };
  }
}

}

export default new GeminiService();
