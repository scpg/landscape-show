#!/usr/bin/env node
/**
 * Cross-platform backend runner
 * Handles PYTHONPATH and Python command detection across Windows/Mac/Linux
 */

import { spawn } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const backendDir = join(projectRoot, 'backend');

console.log('🐍 Starting Python backend...');

// Detect platform
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

console.log(`📍 Platform: ${process.platform}`);

// Detect Python command
function findPythonCommand() {
  const candidates = [
    'python3',  // Preferred on Unix/Mac
    'python',   // Common on Windows, sometimes Unix
    'py'        // Python Launcher on Windows
  ];
  
  for (const cmd of candidates) {
    try {
      const result = spawn(cmd, ['--version'], { stdio: 'pipe' });
      if (result.pid) {
        console.log(`✅ Found Python: ${cmd}`);
        return cmd;
      }
    } catch {
      // Try next candidate
    }
  }
  
  throw new Error('Python not found. Please install Python 3.12+ and ensure it\'s in PATH');
}

// Set up environment
const pythonCommand = findPythonCommand();

// Cross-platform PYTHONPATH
const pythonPath = isWindows ? 
  backendDir.replace(/\//g, '\\') :  // Windows: Use backslashes
  backendDir;                        // Unix: Use forward slashes

console.log(`🔧 Setting PYTHONPATH: ${pythonPath}`);

// Check if virtual environment exists
const venvDir = join(backendDir, '.venv');
const activateScript = isWindows ?
  join(venvDir, 'Scripts', 'python.exe') :
  join(venvDir, 'bin', 'python');

let pythonExecutable = pythonCommand;

if (existsSync(activateScript)) {
  console.log('📦 Using virtual environment');
  pythonExecutable = activateScript;
} else {
  console.log('⚠️  No virtual environment found, using global Python');
  console.log('💡 Run "npm run setup" to create virtual environment');
}

// Set up environment variables
const env = {
  ...process.env,
  PYTHONPATH: pythonPath
};

console.log('🚀 Starting FastAPI server...');
console.log('   Backend will be available at: http://localhost:8000');
console.log('   API docs: http://localhost:8000/docs');
console.log('   Press Ctrl+C to stop');

// Spawn Python process
const pythonProcess = spawn(pythonExecutable, ['-m', 'app.main'], {
  cwd: backendDir,
  env: env,
  stdio: 'inherit'
});

// Handle process events
pythonProcess.on('error', (error) => {
  console.error('❌ Failed to start backend:', error.message);
  
  if (error.code === 'ENOENT') {
    console.error('💡 Possible solutions:');
    console.error('   1. Install Python 3.12+');
    console.error('   2. Run "npm run setup" to set up virtual environment');
    console.error('   3. Check that Python is in your PATH');
  }
  
  process.exit(1);
});

pythonProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend exited with code ${code}`);
    
    if (code === 1) {
      console.error('💡 Common issues:');
      console.error('   - Missing dependencies: run "npm run setup"');
      console.error('   - Port already in use: check if another instance is running');
      console.error('   - Import errors: verify PYTHONPATH is set correctly');
    }
  }
  process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping backend...');
  pythonProcess.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  pythonProcess.kill('SIGTERM');
});