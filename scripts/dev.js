#!/usr/bin/env node
/**
 * Cross-platform development launcher
 * Replaces dev.sh and dev.bat with unified Node.js script
 */

import { execSync, spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Starting Landscape Show development environment...');
console.log(`📍 Platform: ${process.platform}`);

// Cross-platform command detection
function commandExists(command) {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${which} ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Check prerequisites with platform-specific guidance
console.log('🔍 Checking prerequisites...');

if (!commandExists('node')) {
  console.error('❌ Node.js not found');
  console.error('💡 Install from: https://nodejs.org/');
  process.exit(1);
}
console.log('✅ Node.js is available');

// Check Python (try multiple variants)
const pythonCommands = ['python3', 'python', 'py'];
let pythonFound = false;
let pythonCommand = '';

for (const cmd of pythonCommands) {
  if (commandExists(cmd)) {
    pythonCommand = cmd;
    pythonFound = true;
    break;
  }
}

if (!pythonFound) {
  console.error('❌ Python not found');
  console.error('💡 Install Python 3.12+ from:');
  console.error('   - Windows: https://python.org/ or Microsoft Store');
  console.error('   - macOS: brew install python3 or https://python.org/');
  console.error('   - Ubuntu: sudo apt install python3 python3-venv');
  process.exit(1);
}
console.log(`✅ Python is available (${pythonCommand})`);

// Check pnpm (optional but recommended)
if (!commandExists('pnpm')) {
  console.log('⚠️  pnpm not found, will try to install it');
  console.log('💡 Installing pnpm...');
  try {
    execSync('npm install -g pnpm', { stdio: 'inherit' });
    console.log('✅ pnpm installed successfully');
  } catch (error) {
    console.error('❌ Failed to install pnpm');
    console.error('💡 Manual installation: npm install -g pnpm');
    console.error('   Or use npm instead of pnpm in frontend directory');
  }
}

// Check if dependencies are installed (cross-platform paths)
console.log('📦 Checking dependencies...');

const paths = {
  rootNodeModules: join(projectRoot, 'node_modules'),
  frontendNodeModules: join(projectRoot, 'frontend', 'node_modules'),
  backendVenv: join(projectRoot, 'backend', '.venv')
};

// Install missing dependencies
if (!existsSync(paths.rootNodeModules)) {
  console.log('📦 Installing root dependencies...');
  try {
    execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✅ Root dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install root dependencies');
    process.exit(1);
  }
}

if (!existsSync(paths.frontendNodeModules)) {
  console.log('📦 Installing frontend dependencies...');
  try {
    const frontendDir = join(projectRoot, 'frontend');
    if (commandExists('pnpm')) {
      execSync('pnpm install', { cwd: frontendDir, stdio: 'inherit' });
    } else {
      execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
    }
    console.log('✅ Frontend dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install frontend dependencies');
    process.exit(1);
  }
}

if (!existsSync(paths.backendVenv)) {
  console.log('🐍 Setting up Python virtual environment...');
  console.log('💡 Tip: Run "npm run setup" for comprehensive setup with dependency checking');
  
  try {
    const backendDir = join(projectRoot, 'backend');
    
    // Try uv first (if available), then fall back to python venv
    if (commandExists('uv')) {
      console.log('   Using uv (fast)...');
      execSync('uv venv', { cwd: backendDir, stdio: 'inherit' });
      execSync('uv pip install -r requirements.txt', { cwd: backendDir, stdio: 'inherit' });
    } else {
      console.log(`   Using ${pythonCommand} -m venv...`);
      execSync(`${pythonCommand} -m venv .venv`, { cwd: backendDir, stdio: 'inherit' });
      
      // Install requirements using the virtual environment Python
      const venvPython = process.platform === 'win32' ?
        join(backendDir, '.venv', 'Scripts', 'python.exe') :
        join(backendDir, '.venv', 'bin', 'python');
        
      execSync(`"${venvPython}" -m pip install -r requirements.txt`, { 
        cwd: backendDir, 
        stdio: 'inherit' 
      });
    }
    console.log('✅ Backend virtual environment created');
  } catch (error) {
    console.error('❌ Failed to set up Python environment');
    console.error('💡 Try running: npm run setup');
    process.exit(1);
  }
}

console.log('');
console.log('✅ All dependencies ready!');
console.log('🚀 Starting both backend and frontend...');
console.log('   Backend will be available at: http://localhost:8000');
console.log('   Frontend will be available at: http://localhost:5173');
console.log('');
console.log('💡 Press Ctrl+C to stop both services');

// Start both services using npm scripts (cross-platform)
const devProcess = spawn('npm', ['run', 'dev'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true  // Important for cross-platform npm execution
});

// Handle process termination
devProcess.on('error', (error) => {
  console.error('❌ Failed to start development servers:', error.message);
  process.exit(1);
});

devProcess.on('close', (code) => {
  console.log(`\n🛑 Development servers stopped (exit code: ${code})`);
  process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development servers...');
  devProcess.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  devProcess.kill('SIGTERM');
});