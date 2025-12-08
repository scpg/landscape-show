#!/usr/bin/env node
/**
 * Cross-platform Docker test launcher
 * Routes to appropriate script based on platform
 */

import { spawn, execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🐳 Cross-platform Docker test launcher');
console.log(`📍 Platform: ${process.platform}`);

// Check if Docker is available
function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!checkDocker()) {
  console.error('❌ Docker is not installed or not running');
  console.error('💡 Install Docker Desktop:');
  console.error('   - Windows: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe');
  console.error('   - macOS: https://desktop.docker.com/mac/main/amd64/Docker.dmg');
  console.error('   - Ubuntu: https://docs.docker.com/desktop/linux/install/ubuntu/');
  console.error('');
  console.error('   Ensure Docker Desktop is running before retrying');
  process.exit(1);
}

console.log('✅ Docker is available');

// Get command line argument
const command = process.argv[2] || 'all';

console.log(`🎯 Running Docker test: ${command}`);

// Determine which script to use based on platform
let scriptPath;
let scriptArgs;

if (process.platform === 'win32') {
  // Windows: Try to use WSL bash first, fall back to powershell/cmd
  try {
    execSync('bash --version', { stdio: 'ignore' });
    console.log('📍 Using WSL bash for Docker tests');
    scriptPath = 'bash';
    scriptArgs = [join(__dirname, 'test-docker.sh'), command];
  } catch {
    console.error('❌ WSL bash not available');
    console.error('💡 On Windows, you need WSL2 or Git Bash to run Docker tests');
    console.error('   - Install WSL2: wsl --install');
    console.error('   - Or install Git Bash: https://git-scm.com/download/win');
    console.error('');
    console.error('   Alternative: Use Docker Desktop directly with these commands:');
    console.error(`   docker compose -f docker/test-environments/docker-compose.test.yml up test-ubuntu`);
    process.exit(1);
  }
} else {
  // Unix-like systems (Linux, macOS)
  console.log('📍 Using native bash for Docker tests');
  scriptPath = 'bash';
  scriptArgs = [join(__dirname, 'test-docker.sh'), command];
}

console.log('');

// Execute the Docker test script
const testProcess = spawn(scriptPath, scriptArgs, {
  cwd: projectRoot,
  stdio: 'inherit'
});

testProcess.on('error', (error) => {
  console.error('❌ Failed to run Docker tests:', error.message);
  
  if (error.code === 'ENOENT') {
    console.error('💡 Possible solutions:');
    if (process.platform === 'win32') {
      console.error('   1. Install WSL2: wsl --install');
      console.error('   2. Install Git Bash: https://git-scm.com/download/win');
      console.error('   3. Use Docker Desktop UI directly');
    } else {
      console.error('   1. Install bash shell');
      console.error('   2. Make sure scripts are executable: chmod +x scripts/*.sh');
    }
  }
  
  process.exit(1);
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('');
    console.log('🎉 Docker tests completed successfully!');
  } else {
    console.error('');
    console.error(`❌ Docker tests failed with exit code ${code}`);
  }
  process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Docker tests...');
  testProcess.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  testProcess.kill('SIGTERM');
});