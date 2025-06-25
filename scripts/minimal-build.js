#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Minimal build setup...');

const projectRoot = path.join(__dirname, '..');

// Remove all problematic files
const filesToRemove = [
  'node_modules',
  'package-lock.json',
  'yarn.lock',
  '.expo',
  '.yarn',
  'dist',
  'build'
];

filesToRemove.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Removing ${file}...`);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
});

// Clear npm cache
console.log('🧹 Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.log('Cache clean failed, continuing...');
}

// Install minimal dependencies
console.log('📦 Installing minimal dependencies...');
try {
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit', 
    cwd: projectRoot
  });
  
  console.log('✅ Dependencies installed!');
  
  // Test config
  console.log('🔍 Testing config...');
  execSync('npx expo config --json > /dev/null', { 
    cwd: projectRoot 
  });
  
  console.log('✅ Config is valid!');
  console.log('🎉 Ready for build!');
  console.log('Run: eas build --platform android --profile production');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n🔧 Try manual steps:');
  console.log('1. rm -rf node_modules package-lock.json');
  console.log('2. npm install --legacy-peer-deps');
  console.log('3. npx expo config --json');
  console.log('4. eas build --platform android --profile production');
  process.exit(1);
}
