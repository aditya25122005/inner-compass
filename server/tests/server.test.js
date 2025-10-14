import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

// Test credentials for demo purposes (you might want to adjust these)
const TEST_USER = {
  email: 'test@innercompass.com',
  password: 'TestPassword123',
  name: 'Test User'
};

let authToken = null;
let testUserId = null;

console.log(' Starting InnerCompass Server Integration Tests...\n');

// Helper function to make authenticated requests
const authRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.data = data;
  }
  
  return axios(config);
};

async function testServerHealth() {
  console.log('1 Testing Server Health...');
  
  try {
    const response = await axios.get(`${BASE_URL}/`);
    
    if (response.status === 200) {
      console.log(' Server is running');
      console.log(`Response: ${response.data}`);
      return true;
    } else {
      console.log('  Server health check failed');
      return false;
    }
  } catch (error) {
    console.log('  Server is not running or not accessible');
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n2. Testing User Registration...');
  
  try {
    // Try to register a test user
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: TEST_USER.name
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log(' User registration successful (or user already exists)');
      testUserId = response.data.user?._id;
      return true;
    } else {
      console.log('User registration failed');
      return false;
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log(' User already exists (this is fine for testing)');
      return true;
    }
    console.log('User registration error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n3. Testing User Login...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (response.status === 200 && response.data.accessToken) {
      console.log(' User login successful');
      authToken = response.data.accessToken;
      testUserId = response.data.user._id;
      console.log(' Auth token obtained');
      return true;
    } else {
      console.log('  User login failed - no token received');
      return false;
    }
  } catch (error) {
    console.log('  User login error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testChatbotHealth() {
  console.log('\n4.Testing Chatbot Health...');
  
  if (!authToken) {
    console.log('  No auth token available - cannot test chatbot');
    return false;
  }
  
  try {
    const response = await authRequest('GET', '/api/chatbot/health');
    
    if (response.status === 200) {
      console.log(' Chatbot health check passed');
      console.log(`  Status: ${response.data.data.status}`);
      console.log(` Gemini API: ${response.data.data.geminiApi}`);
      return response.data.data.geminiApi === 'connected';
    } else {
      console.log(' Chatbot health check failed');
      return false;
    }
  } catch (error) {
    console.log('Chatbot health check error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testChatbotConversation() {
  console.log('\n5.Testing Chatbot Conversation...');
  
  if (!authToken) {
    console.log('No auth token available - cannot test chatbot');
    return false;
  }
  
  try {
    const response = await authRequest('POST', '/api/chatbot/chat', {
      message: 'Hello! This is a test message. How are you today?'
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('Chatbot conversation successful');
      console.log(`User message: ${response.data.data.userMessage.message.substring(0, 50)}...`);
      console.log(`Bot response: ${response.data.data.botMessage.message.substring(0, 100)}...`);
      return true;
    } else {
      console.log('Chatbot conversation failed');
      return false;
    }
  } catch (error) {
    console.log('Chatbot conversation error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testChatHistory() {
  console.log('\n6.Testing Chat History...');
  
  if (!authToken) {
    console.log('No auth token available - cannot test history');
    return false;
  }
  
  try {
    const response = await authRequest('GET', '/api/chatbot/history');
    
    if (response.status === 200 && response.data.success) {
      console.log('Chat history retrieved successfully');
      console.log(`Total messages: ${response.data.data.pagination.totalMessages}`);
      return true;
    } else {
      console.log('Chat history retrieval failed');
      return false;
    }
  } catch (error) {
    console.log('Chat history error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testMoodAnalysis() {
  console.log('\n7.Testing Mood Analysis...');
  
  if (!authToken) {
    console.log('No auth token available - cannot test mood analysis');
    return false;
  }
  
  try {
    const response = await authRequest('POST', '/api/chatbot/analyze-mood', {
      message: 'I feel really anxious about my upcoming job interview tomorrow.'
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('Mood analysis completed');
      console.log(`Analysis: ${response.data.data.analysis.substring(0, 100)}...`);
      return true;
    } else {
      console.log('Mood analysis failed');
      return false;
    }
  } catch (error) {
    console.log('Mood analysis error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testJournalPrompt() {
  console.log('\n8.Testing Journal Prompt Generation...');
  
  if (!authToken) {
    console.log('No auth token available - cannot test journal prompt');
    return false;
  }
  
  try {
    const response = await authRequest('GET', '/api/chatbot/journal-prompt?topic=mindfulness');
    
    if (response.status === 200 && response.data.success) {
      console.log('Journal prompt generated');
      console.log(`Prompt: ${response.data.data.prompt.substring(0, 100)}...`);
      return true;
    } else {
      console.log('Journal prompt generation failed');
      return false;
    }
  } catch (error) {
    console.log('Journal prompt error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testChatbotStats() {
  console.log('\n9. Testing Chatbot Statistics...');
  
  if (!authToken) {
    console.log('No auth token available - cannot test stats');
    return false;
  }
  
  try {
    const response = await authRequest('GET', '/api/chatbot/stats');
    
    if (response.status === 200 && response.data.success) {
      console.log('    Chatbot statistics retrieved');
      console.log(`    Total messages: ${response.data.data.totalMessages}`);
      console.log(`    User messages: ${response.data.data.userMessages}`);
      console.log(`    Bot messages: ${response.data.data.botMessages}`);
      return true;
    } else {
      console.log('    Chatbot statistics failed');
      return false;
    }
  } catch (error) {
    console.log('    Chatbot statistics error:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runAllServerTests() {
  console.log(' Running InnerCompass Server Integration Test Suite\n');
  console.log('=' .repeat(70));
  
  const tests = [
    { name: 'Server Health', test: testServerHealth },
    { name: 'User Registration', test: testUserRegistration },
    { name: 'User Login', test: testUserLogin },
    { name: 'Chatbot Health', test: testChatbotHealth },
    { name: 'Chatbot Conversation', test: testChatbotConversation },
    { name: 'Chat History', test: testChatHistory },
    { name: 'Mood Analysis', test: testMoodAnalysis },
    { name: 'Journal Prompt', test: testJournalPrompt },
    { name: 'Chatbot Statistics', test: testChatbotStats }
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    const passed = await test();
    results.push({ name, passed });
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log(' Server Test Results Summary:');
  console.log('=' .repeat(70));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? 'Yes' : 'No'} ${name}`);
  });
  
  console.log('\n' + '=' .repeat(70));
  console.log(` Server Tests Complete: ${passed}/${total} passed`);
  console.log(` Server URL: ${BASE_URL}`);
  console.log(` Chatbot Endpoint: ${BASE_URL}/api/chatbot`);
  
  if (passed === total) {
    console.log(' All server tests passed! InnerCompass with Gemini integration is working perfectly.');
  } else {
    console.log('  Some tests failed. Please check the server configuration and try again.');
  }
  
  console.log('=' .repeat(70));
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllServerTests().catch(console.error);
}

export default {
  runAllServerTests,
  testServerHealth,
  testChatbotConversation,
  testMoodAnalysis
};
