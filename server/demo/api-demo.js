#!/usr/bin/env node

/**
 * InnerCompass Gemini Chatbot API Demo
 * 
 * This demo shows how to interact with the chatbot API endpoints.
 * Make sure to:
 * 1. Configure your .env file with GEMINI_API_KEY
 * 2. Start the server: npm start
 * 3. Create a user account and get an auth token
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let authToken = null;

// Demo user credentials - change these for your testing
const DEMO_USER = {
  email: 'demo@innercompass.com',
  password: 'DemoPassword123',
  name: 'Demo User'
};

console.log('🎭 InnerCompass Gemini Chatbot API Demo');
console.log('=' .repeat(50));

async function makeRequest(method, endpoint, data = null, requireAuth = false) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (requireAuth && authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        message: error.response.data.message || 'Unknown error'
      };
    }
    return {
      error: true,
      message: error.message
    };
  }
}

async function registerAndLogin() {
  console.log('\n1. 👤 Setting up demo user...');
  
  // Try to register (might already exist)
  const registerResult = await makeRequest('POST', '/api/auth/register', DEMO_USER);
  
  if (!registerResult.error || registerResult.message.includes('already exists')) {
    console.log('   ✅ User account ready');
  } else {
    console.log('   ❌ Registration failed:', registerResult.message);
    return false;
  }
  
  // Login to get token
  const loginResult = await makeRequest('POST', '/api/auth/login', {
    email: DEMO_USER.email,
    password: DEMO_USER.password
  });
  
  if (!loginResult.error && loginResult.accessToken) {
    authToken = loginResult.accessToken;
    console.log('   ✅ Login successful, token obtained');
    return true;
  } else {
    console.log('   ❌ Login failed:', loginResult.message);
    return false;
  }
}

async function testChatbotHealth() {
  console.log('\n2. 🏥 Testing chatbot health...');
  
  const result = await makeRequest('GET', '/api/chatbot/health', null, true);
  
  if (!result.error) {
    console.log('   ✅ Chatbot service is healthy');
    console.log(`   📊 Status: ${result.data.status}`);
    console.log(`   🔗 Gemini API: ${result.data.geminiApi}`);
    return result.data.geminiApi === 'connected';
  } else {
    console.log('   ❌ Chatbot health check failed:', result.message);
    return false;
  }
}

async function demoConversation() {
  console.log('\n3. 💬 Starting demo conversation...');
  
  const messages = [
    "Hello! I'm feeling a bit stressed about work lately.",
    "I have a big presentation tomorrow and I'm really anxious about it.",
    "Thank you for listening. What are some techniques I can use to calm my nerves?",
    "That's helpful advice. I'll try the breathing exercises."
  ];
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    console.log(`\\n   👤 User: ${message}`);
    
    const result = await makeRequest('POST', '/api/chatbot/chat', { message }, true);
    
    if (!result.error) {
      const botResponse = result.data.botMessage.message;
      console.log(`   🤖 InnerCompass: ${botResponse.substring(0, 100)}...`);
    } else {
      console.log(`   ❌ Chat error: ${result.message}`);
      break;
    }
    
    // Small delay between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function demoMoodAnalysis() {
  console.log('\\n4. 🎭 Testing mood analysis...');
  
  const moodMessages = [
    "I'm feeling really excited about my vacation next week!",
    "I've been feeling pretty down lately and don't know why.",
    "Work has been overwhelming and I feel burned out."
  ];
  
  for (const message of moodMessages) {
    console.log(`\\n   📝 Analyzing: "${message}"`);
    
    const result = await makeRequest('POST', '/api/chatbot/analyze-mood', { message }, true);
    
    if (!result.error) {
      console.log(`   🎯 Analysis: ${result.data.analysis.substring(0, 150)}...`);
    } else {
      console.log(`   ❌ Analysis error: ${result.message}`);
    }
  }
}

async function demoJournalPrompts() {
  console.log('\\n5. 📖 Testing journal prompts...');
  
  const topics = ['gratitude', 'mindfulness', 'self-reflection'];
  
  for (const topic of topics) {
    console.log(`\\n   📝 Topic: ${topic}`);
    
    const result = await makeRequest('GET', `/api/chatbot/journal-prompt?topic=${topic}`, null, true);
    
    if (!result.error) {
      console.log(`   ✍️  Prompt: ${result.data.prompt.substring(0, 120)}...`);
    } else {
      console.log(`   ❌ Prompt error: ${result.message}`);
    }
  }
}

async function showStats() {
  console.log('\\n6. 📊 Checking chat statistics...');
  
  const result = await makeRequest('GET', '/api/chatbot/stats', null, true);
  
  if (!result.error) {
    console.log(`   💬 Total messages: ${result.data.totalMessages}`);
    console.log(`   👤 User messages: ${result.data.userMessages}`);
    console.log(`   🤖 Bot messages: ${result.data.botMessages}`);
  } else {
    console.log(`   ❌ Stats error: ${result.message}`);
  }
}

async function runDemo() {
  try {
    // Step 1: Setup authentication
    const authSuccess = await registerAndLogin();
    if (!authSuccess) {
      console.log('\\n❌ Demo failed: Could not authenticate user');
      return;
    }
    
    // Step 2: Check health
    const healthSuccess = await testChatbotHealth();
    if (!healthSuccess) {
      console.log('\\n⚠️  Chatbot API may not be properly configured');
      console.log('   Make sure your .env file contains a valid GEMINI_API_KEY');
    }
    
    // Step 3: Demo conversation
    await demoConversation();
    
    // Step 4: Mood analysis
    await demoMoodAnalysis();
    
    // Step 5: Journal prompts
    await demoJournalPrompts();
    
    // Step 6: Show stats
    await showStats();
    
    console.log('\\n' + '=' .repeat(50));
    console.log('🎉 Demo complete!');
    console.log('\\n🔗 API Endpoints demonstrated:');
    console.log('  • POST /api/chatbot/chat');
    console.log('  • POST /api/chatbot/analyze-mood');
    console.log('  • GET  /api/chatbot/journal-prompt');
    console.log('  • GET  /api/chatbot/health');
    console.log('  • GET  /api/chatbot/stats');
    console.log('\\n💡 Try the interactive setup: npm run setup');
    console.log('📚 Full documentation: GEMINI_INTEGRATION.md');
    
  } catch (error) {
    console.error('\\n❌ Demo failed with error:', error.message);
  }
}

// Handle interruption gracefully
process.on('SIGINT', () => {
  console.log('\\n\\n👋 Demo interrupted. Goodbye!');
  process.exit(0);
});

// Check if server is running before starting demo
async function checkServer() {
  try {
    await axios.get(BASE_URL);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('\\n❌ Server is not running!');
    console.log('   Please start the server first: npm start');
    console.log('   Then run this demo again: node demo/api-demo.js');
    return;
  }
  
  await runDemo();
}

main().catch(console.error);
