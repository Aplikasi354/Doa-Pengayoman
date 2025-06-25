#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning project...');

// Remove node_modules
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('Removing node_modules...');
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
}

// Remove package-lock.json
const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
  console.log('Removing package-lock.json...');
  fs.unlinkSync(packageLockPath);
}

// Remove yarn.lock if exists
const yarnLockPath = path.join(__dirname, '..', 'yarn.lock');
if (fs.existsSync(yarnLockPath)) {
  console.log('Removing yarn.lock...');
  fs.unlinkSync(yarnLockPath);
}

// Remove .expo folder
const expoPath = path.join(__dirname, '..', '.expo');
if (fs.existsSync(expoPath)) {
  console.log('Removing .expo folder...');
  fs.rmSync(expoPath, { recursive: true, force: true });
}

console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Clean install completed!');
} catch (error) {
  console.error('❌ Install failed:', error.message);
  process.exit(1);
}
