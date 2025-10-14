#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupEnvironment() {
  console.log('InnerCompass Server Setup\n');
  console.log('=' .repeat(50));
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('  .env file already exists!');
    const overwrite = await question('Do you want to overwrite it? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Your existing .env file is unchanged.');
      rl.close();
      return;
    }
  }
  
  console.log('\nLet\'s configure your InnerCompass server:\n');
  
  // Collect configuration
  const config = {};
  
  // Database
  console.log(' Database Configuration:');
  config.MONGODB_URI = await question('MongoDB URI (or press Enter for local): ') 
    || 'mongodb://localhost:27017/inner-compass';
  
  // Server
  console.log('Server Configuration:');
  config.PORT = await question('Server port (default 5000): ') || '5000';
  config.CORS_ORIGIN = await question('Frontend URL (default http://localhost:3000): ') 
    || 'http://localhost:3000';
  
  // JWT Secrets
  console.log('Security Configuration:');
  config.ACCESS_TOKEN_SECRET = await question('Access token secret (or press Enter for auto-generated): ') 
    || generateRandomSecret(64);
  config.REFRESH_TOKEN_SECRET = await question('Refresh token secret (or press Enter for auto-generated): ') 
    || generateRandomSecret(64);
  
  // Gemini API
  console.log('Gemini AI Configuration:');
  config.GEMINI_API_KEY = await question('Gemini API Key (required for chatbot functionality): ');
  
  if (!config.GEMINI_API_KEY) {
    console.log('WARNING: No Gemini API key provided!');
    console.log('The chatbot functionality will not work without a valid Gemini API key.');
    console.log('You can get one from: https://makersuite.google.com/app/apikey');
    const continueSetup = await question('Continue anyway? (y/N): ');
    if (continueSetup.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Please get a Gemini API key and run setup again.');
      rl.close();
      return;
    }
  }
  
  // Additional settings
  config.NODE_ENV = 'development';
  config.BCRYPT_SALT_ROUNDS = '12';
  config.SESSION_TIMEOUT = '7d';
  
  // Generate .env file content
  let envContent = '# InnerCompass Server Configuration\n';
  envContent += '# Generated automatically on ' + new Date().toISOString() + '\n\n';
  
  envContent += '# Database\n';
  envContent += `MONGODB_URI=${config.MONGODB_URI}\n\n`;
  
  envContent += '# Server Configuration\n';
  envContent += `PORT=${config.PORT}\n`;
  envContent += `NODE_ENV=${config.NODE_ENV}\n\n`;
  
  envContent += '# CORS Configuration\n';
  envContent += `CORS_ORIGIN=${config.CORS_ORIGIN}\n\n`;
  
  envContent += '# JWT Configuration\n';
  envContent += `ACCESS_TOKEN_SECRET=${config.ACCESS_TOKEN_SECRET}\n`;
  envContent += `REFRESH_TOKEN_SECRET=${config.REFRESH_TOKEN_SECRET}\n\n`;
  
  envContent += '# Gemini AI Configuration\n';
  envContent += `GEMINI_API_KEY=${config.GEMINI_API_KEY}\n\n`;
  
  envContent += '# Additional Security\n';
  envContent += `BCRYPT_SALT_ROUNDS=${config.BCRYPT_SALT_ROUNDS}\n\n`;
  
  envContent += '# Session Configuration\n';
  envContent += `SESSION_TIMEOUT=${config.SESSION_TIMEOUT}\n`;
  
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('Environment configuration complete!');
  console.log(`Configuration saved to: ${envPath}`);
  
  // Show next steps
  console.log('Next Steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Start the server: npm start');
  console.log(`3. Server will be available at: http://localhost:${config.PORT}`);
  console.log(`4. Chatbot API will be at: http://localhost:${config.PORT}/api/chatbot`);
  
  if (!config.GEMINI_API_KEY) {
    console.log(' Remember to add your Gemini API key to the .env file!');
  }
  
  console.log('Testing:');
  console.log('- Test Gemini service: node tests/gemini.test.js');
  console.log('- Test server endpoints: node tests/server.test.js');
  
  rl.close();
}

function generateRandomSecret(length = 64) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nSetup cancelled.');
  rl.close();
  process.exit(0);
});

// Run setup
setupEnvironment().catch((error) => {
  console.error('Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
