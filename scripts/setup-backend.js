#!/usr/bin/env node
/**
 * Backend setup script - handles Python virtual environment and dependencies
 * Cross-platform Node.js script for reliable backend setup
 */

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = join(__dirname, '..', 'backend');

console.log('🐍 Setting up Python backend...');

// Helper function to check if command exists
function commandExists(command) {
  try {
    execSync(`${process.platform === 'win32' ? 'where' : 'which'} ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Helper function to run command with error handling
function runCommand(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', cwd: backendDir, ...options });
    return true;
  } catch (error) {
    console.error(`❌ Failed to run: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Check Python availability
if (!commandExists('python') && !commandExists('python3')) {
  console.error('❌ Python not found. Please install Python 3.12+ first.');
  process.exit(1);
}

const pythonCommand = commandExists('python3') ? 'python3' : 'python';
console.log(`✅ Found Python: ${pythonCommand}`);

// Check if virtual environment exists
const venvDir = join(backendDir, '.venv');
if (existsSync(venvDir)) {
  console.log('✅ Virtual environment already exists');
} else {
  console.log('📦 Creating virtual environment...');
  
  // Try uv first, then fall back to python venv
  if (commandExists('uv')) {
    console.log('   Using uv (fast)...');
    if (!runCommand('uv venv')) {
      process.exit(1);
    }
  } else {
    console.log('   Using python -m venv...');
    if (!runCommand(`${pythonCommand} -m venv .venv`)) {
      process.exit(1);
    }
  }
}

// Check if dependencies are installed
const activateScript = process.platform === 'win32' 
  ? join(venvDir, 'Scripts', 'activate.bat')
  : join(venvDir, 'bin', 'activate');

const pythonInVenv = process.platform === 'win32'
  ? join(venvDir, 'Scripts', 'python.exe')
  : join(venvDir, 'bin', 'python');

// Test if FastAPI is installed
try {
  execSync(`"${pythonInVenv}" -c "import fastapi"`, { stdio: 'ignore' });
  console.log('✅ Python dependencies already installed');
} catch {
  console.log('📦 Installing Python dependencies...');
  
  // Install dependencies
  if (commandExists('uv')) {
    if (!runCommand('uv pip install -r requirements.txt')) {
      process.exit(1);
    }
  } else {
    const installCmd = process.platform === 'win32'
      ? `"${pythonInVenv}" -m pip install -r requirements.txt`
      : `"${pythonInVenv}" -m pip install -r requirements.txt`;
    
    if (!runCommand(installCmd)) {
      process.exit(1);
    }
  }
}

console.log('✅ Backend setup complete!');