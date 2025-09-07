#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 InnerCompass Gemini Integration Verification');
console.log('=' .repeat(50));

const checks = [];

function addCheck(name, status, details = '') {
  checks.push({ name, status, details });
  const icon = status ? '✅' : '❌';
  console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
}

// Check if GeminiBot folder was removed
addCheck(
  'GeminiBot folder removed',
  !fs.existsSync(path.join(__dirname, 'GeminiBot')),
  'Separate folder successfully removed'
);

// Check server integration
const serverFiles = [
  'server/services/geminiService.js',
  'server/routes/chatbot.route.js',
  'server/tests/gemini.test.js',
  'server/tests/server.test.js',
  'server/demo/api-demo.js',
  'server/.env.example',
  'server/setup.js'
];

serverFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  addCheck(
    `Server file: ${file}`,
    exists,
    exists ? 'Present' : 'Missing'
  );
});

// Check client integration
const clientFiles = [
  'client/src/services/chatbotApi.js',
  'client/src/components/chatbot/Chatbot.jsx',
  'client/src/components/chatbot/ChatMessage.jsx',
  'client/src/components/chatbot/ChatStats.jsx',
  'client/src/components/chatbot/MoodAnalyzer.jsx',
  'client/src/pages/ChatbotPage.jsx'
];

clientFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  addCheck(
    `Client file: ${file}`,
    exists,
    exists ? 'Present' : 'Missing'
  );
});

// Check package.json updates
try {
  const serverPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/package.json'), 'utf8'));
  const hasGeminiDep = serverPackage.dependencies['@google/generative-ai'];
  const hasAxios = serverPackage.dependencies['axios'];
  
  addCheck(
    'Server has Gemini dependency',
    !!hasGeminiDep,
    hasGeminiDep || 'Missing @google/generative-ai'
  );
  
  addCheck(
    'Server has Axios dependency',
    !!hasAxios,
    hasAxios || 'Missing axios'
  );
} catch (error) {
  addCheck('Server package.json check', false, 'Could not read server package.json');
}

try {
  const clientPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'client/package.json'), 'utf8'));
  const hasLucide = clientPackage.dependencies['lucide-react'];
  const hasMarkdown = clientPackage.dependencies['react-markdown'];
  
  addCheck(
    'Client has Lucide icons',
    !!hasLucide,
    hasLucide || 'Missing lucide-react'
  );
  
  addCheck(
    'Client has Markdown support',
    !!hasMarkdown,
    hasMarkdown || 'Missing react-markdown'
  );
} catch (error) {
  addCheck('Client package.json check', false, 'Could not read client package.json');
}

// Check if main server index.js includes chatbot routes
try {
  const serverIndex = fs.readFileSync(path.join(__dirname, 'server/index.js'), 'utf8');
  const hasChatbotRoute = serverIndex.includes('chatbot.route.js') && serverIndex.includes('/api/chatbot');
  
  addCheck(
    'Server includes chatbot routes',
    hasChatbotRoute,
    hasChatbotRoute ? 'Routes properly integrated' : 'Missing chatbot route integration'
  );
} catch (error) {
  addCheck('Server index.js check', false, 'Could not read server index.js');
}

// Check if client App.jsx includes chatbot routes
try {
  const appJsx = fs.readFileSync(path.join(__dirname, 'client/src/App.jsx'), 'utf8');
  const hasChatbotPage = appJsx.includes('ChatbotPage') && appJsx.includes('/chatbot');
  
  addCheck(
    'Client includes chatbot routes',
    hasChatbotPage,
    hasChatbotPage ? 'Routes properly integrated' : 'Missing chatbot route integration'
  );
} catch (error) {
  addCheck('Client App.jsx check', false, 'Could not read client App.jsx');
}

console.log('\n' + '=' .repeat(50));
console.log('📊 Verification Summary:');

const passed = checks.filter(c => c.status).length;
const total = checks.length;

console.log(`✅ Passed: ${passed}/${total} checks`);

if (passed === total) {
  console.log('\n🎉 Integration Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Configure environment variables:');
  console.log('   cd server && npm run setup');
  console.log('');
  console.log('2. Start the server:');
  console.log('   cd server && npm start');
  console.log('');
  console.log('3. Start the client (in a new terminal):');
  console.log('   cd client && npm run dev');
  console.log('');
  console.log('4. Visit http://localhost:3000 and navigate to /chatbot');
  console.log('');
  console.log('🔗 API Endpoints available at:');
  console.log('   http://localhost:5000/api/chatbot/*');
  console.log('');
  console.log('📚 Documentation:');
  console.log('   See GEMINI_INTEGRATION.md for full details');
} else {
  console.log(`\n⚠️  ${total - passed} checks failed. Please review the missing components above.`);
}

console.log('=' .repeat(50));
