#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing dependencies for EAS build...');

const projectRoot = path.join(__dirname, '..');

// Remove problematic files
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

// Install with specific flags for EAS compatibility
console.log('📦 Installing dependencies with npm...');
try {
  execSync('npm install --legacy-peer-deps --no-audit --no-fund --force', {
    stdio: 'inherit',
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  console.log('✅ Dependencies installed successfully!');
  
  // Verify critical packages
  const criticalPackages = [
    'expo',
    'react-native',
    'react-native-google-mobile-ads',
    '@react-native-async-storage/async-storage'
  ];
  
  console.log('🔍 Verifying critical packages...');
  criticalPackages.forEach(pkg => {
    const pkgPath = path.join(projectRoot, 'node_modules', pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`✅ ${pkg} - OK`);
    } else {
      console.log(`❌ ${pkg} - MISSING`);
    }
  });
  
  console.log('🎉 Ready for EAS build!');
  console.log('Run: eas build --platform android --profile production');
  
} catch (error) {
  console.error('❌ Install failed:', error.message);
  console.log('\n🔧 Try manual steps:');
  console.log('1. rm -rf node_modules package-lock.json');
  console.log('2. npm install --legacy-peer-deps');
  console.log('3. eas build --platform android --profile production');
  process.exit(1);
}
