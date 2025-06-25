#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning project for build...');

// Remove problematic files
const filesToRemove = [
  'node_modules',
  'package-lock.json',
  'yarn.lock',
  '.expo',
  'dist',
  'build'
];

filesToRemove.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`Removing ${file}...`);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
});

console.log('📦 Installing dependencies...');
try {
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') 
  });
  console.log('✅ Clean install completed!');
  
  console.log('🚀 Starting build...');
  execSync('eas build --platform android --profile production', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') 
  });
  
} catch (error) {
  console.error('❌ Process failed:', error.message);
  process.exit(1);
}
