import geminiService from '../services/geminiService.js';
import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config();

console.log('🧪 Starting Gemini Service Tests...\n');

async function testGeminiConnection() {
  console.log('1. 🔗 Testing Gemini API Connection...');
  
  try {
    const result = await geminiService.testConnection();
    
    if (result.success) {
      console.log('   ✅ Gemini API is working!');
      console.log('   🤖 Test response:', result.response);
      return true;
    } else {
      console.log('   ❌ Gemini API test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Test error:', error.message);
    return false;
  }
}

async function testBasicResponse() {
  console.log('\n2. 💬 Testing Basic Response Generation...');
  
  try {
    const response = await geminiService.generateResponse('Hello, how are you today?');
    
    if (response && response.length > 0) {
      console.log('   ✅ Basic response generated successfully');
      console.log('   📝 Response:', response.substring(0, 100) + (response.length > 100 ? '...' : ''));
      return true;
    } else {
      console.log('   ❌ Empty response received');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error generating response:', error.message);
    return false;
  }
}

async function testContextualResponse() {
  console.log('\n3. 🔄 Testing Contextual Response...');
  
  try {
    const context = [
      { sender: 'user', message: 'I had a really tough day at work today.' },
      { sender: 'bot', message: 'I\'m sorry to hear that. Work stress can be really challenging. What happened that made your day particularly difficult?' }
    ];
    
    const response = await geminiService.generateResponse('My boss was very demanding and I felt overwhelmed', context);
    
    if (response && response.length > 0) {
      console.log('   ✅ Contextual response generated successfully');
      console.log('   📝 Contextual response:', response.substring(0, 150) + (response.length > 150 ? '...' : ''));
      return true;
    } else {
      console.log('   ❌ Empty contextual response received');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error generating contextual response:', error.message);
    return false;
  }
}

async function testMoodAnalysis() {
  console.log('\n4. 😊 Testing Mood Analysis...');
  
  try {
    const moodResponse = await geminiService.analyzeMood('I feel really anxious about my upcoming presentation tomorrow.');
    
    if (moodResponse && moodResponse.length > 0) {
      console.log('   ✅ Mood analysis completed');
      console.log('   🎭 Analysis:', moodResponse.substring(0, 150) + (moodResponse.length > 150 ? '...' : ''));
      return true;
    } else {
      console.log('   ❌ Empty mood analysis response received');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error in mood analysis:', error.message);
    return false;
  }
}

async function testJournalPrompt() {
  console.log('\n5. 📔 Testing Journal Prompt Generation...');
  
  try {
    const journalPrompt = await geminiService.generateJournalPrompt('gratitude');
    
    if (journalPrompt && journalPrompt.length > 0) {
      console.log('   ✅ Journal prompt generated');
      console.log('   ✍️  Prompt:', journalPrompt.substring(0, 150) + (journalPrompt.length > 150 ? '...' : ''));
      return true;
    } else {
      console.log('   ❌ Empty journal prompt received');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error generating journal prompt:', error.message);
    return false;
  }
}

async function testFallbackBehavior() {
  console.log('\n6. 🛡️  Testing Fallback Behavior...');
  
  try {
    // Temporarily modify the service to simulate API failure
    const originalApiKey = geminiService.apiKey;
    geminiService.apiKey = 'invalid-key-for-testing';
    
    const response = await geminiService.generateResponse('This should trigger fallback');
    
    // Restore the original API key
    geminiService.apiKey = originalApiKey;
    
    if (response && response.includes('trouble connecting') || response.includes('technical difficulties')) {
      console.log('   ✅ Fallback behavior working correctly');
      console.log('   🔄 Fallback response:', response.substring(0, 100) + '...');
      return true;
    } else {
      console.log('   ❌ Fallback behavior not triggered correctly');
      console.log('   📝 Response:', response);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Error testing fallback behavior:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Running InnerCompass Gemini Integration Test Suite\n');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: 'Gemini Connection', test: testGeminiConnection },
    { name: 'Basic Response', test: testBasicResponse },
    { name: 'Contextual Response', test: testContextualResponse },
    { name: 'Mood Analysis', test: testMoodAnalysis },
    { name: 'Journal Prompt', test: testJournalPrompt },
    { name: 'Fallback Behavior', test: testFallbackBehavior }
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    const passed = await test();
    results.push({ name, passed });
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Test Results Summary:');
  console.log('=' .repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🏁 Tests Complete: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Gemini integration is working perfectly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the configuration and try again.');
  }
  
  console.log('=' .repeat(60));
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export default {
  testGeminiConnection,
  testBasicResponse,
  testContextualResponse,
  testMoodAnalysis,
  testJournalPrompt,
  testFallbackBehavior,
  runAllTests
};
