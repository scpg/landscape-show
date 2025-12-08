#!/usr/bin/env node
/**
 * Cross-platform setup script
 * Replaces setup.sh and setup.bat with unified Node.js script
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔧 Setting up Landscape Show development environment...');
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
  console.error('❌ Node.js is required but not installed');
  console.error('💡 Installation instructions:');
  console.error('   - Windows: Download from https://nodejs.org/ or use winget install OpenJS.NodeJS');
  console.error('   - macOS: brew install node or download from https://nodejs.org/');
  console.error('   - Ubuntu: sudo apt update && sudo apt install nodejs npm');
  console.error('   See docs/GETTING_STARTED.md for more details');
  process.exit(1);
}
console.log('✅ Node.js is available');

// Check Python (multiple variants for cross-platform compatibility)
const pythonCommands = ['python3', 'python', 'py'];
let pythonFound = false;
let pythonCommand = '';

for (const cmd of pythonCommands) {
  if (commandExists(cmd)) {
    try {
      const version = execSync(`${cmd} --version`, { encoding: 'utf8' });
      if (version.includes('Python 3.')) {
        pythonCommand = cmd;
        pythonFound = true;
        console.log(`✅ Found Python: ${cmd} (${version.trim()})`);
        break;
      }
    } catch {
      // Try next command
    }
  }
}

if (!pythonFound) {
  console.error('❌ Python 3.12+ is required but not found');
  console.error('💡 Installation instructions:');
  console.error('   - Windows: https://python.org/ or Microsoft Store "Python 3.12"');
  console.error('   - macOS: brew install python3 or https://python.org/');
  console.error('   - Ubuntu: sudo apt install python3 python3-venv python3-pip');
  console.error('   See docs/GETTING_STARTED.md for more details');
  process.exit(1);
}

// Check for package managers (with installation hints)
let packageManagerInstaller = 'npm';
if (commandExists('pnpm')) {
  packageManagerInstaller = 'pnpm';
  console.log('✅ Using pnpm for frontend package management');
} else {
  console.log('⚠️  pnpm not found, using npm (pnpm recommended for better performance)');
  console.log('💡 Install pnpm: npm install -g pnpm');
}

// Check for Python package managers
let pythonInstaller = 'pip';
if (commandExists('uv')) {
  pythonInstaller = 'uv';
  console.log('✅ Using uv for Python package management (fast!)');
} else {
  console.log('⚠️  uv not found, using pip (uv recommended for better performance)');
  console.log('💡 Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh');
}

console.log('');

// Install root dependencies (skip if already installed)
const rootNodeModules = join(projectRoot, 'node_modules');
if (!existsSync(rootNodeModules)) {
  console.log('📦 Installing root-level dependencies...');
  try {
    execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✅ Root dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install root dependencies');
    console.error('💡 Check your internet connection and npm configuration');
    process.exit(1);
  }
} else {
  console.log('✅ Root dependencies already installed');
}

// Setup backend (skip if already set up)
console.log('🐍 Setting up Python backend...');
const backendDir = join(projectRoot, 'backend');
const venvPath = join(backendDir, '.venv');

if (!existsSync(venvPath)) {
  console.log('   Creating virtual environment...');
  try {
    if (pythonInstaller === 'uv') {
      execSync('uv venv', { cwd: backendDir, stdio: 'inherit' });
    } else {
      execSync(`${pythonCommand} -m venv .venv`, { cwd: backendDir, stdio: 'inherit' });
    }
    console.log('✅ Virtual environment created');
  } catch (error) {
    console.error('❌ Failed to create virtual environment');
    console.error(`💡 Try manually: cd backend && ${pythonCommand} -m venv .venv`);
    process.exit(1);
  }
} else {
  console.log('✅ Python virtual environment already exists');
}

// Install Python dependencies
console.log('   Installing Python dependencies...');
try {
  // Test if FastAPI is already installed
  const venvPython = process.platform === 'win32' ?
    join(venvPath, 'Scripts', 'python.exe') :
    join(venvPath, 'bin', 'python');
    
  try {
    execSync(`"${venvPython}" -c "import fastapi"`, { stdio: 'ignore' });
    console.log('✅ Python dependencies already installed');
  } catch {
    console.log('   Installing missing Python dependencies...');
    if (pythonInstaller === 'uv') {
      execSync('uv pip install -r requirements.txt', { cwd: backendDir, stdio: 'inherit' });
    } else {
      execSync(`"${venvPython}" -m pip install -r requirements.txt`, { 
        cwd: backendDir, 
        stdio: 'inherit' 
      });
    }
    console.log('✅ Python dependencies installed');
  }
} catch (error) {
  console.error('❌ Failed to install Python dependencies');
  console.error('💡 Check backend/requirements.txt and your Python installation');
  process.exit(1);
}

// Setup frontend (skip if already set up)
console.log('⚛️  Setting up React frontend...');
const frontendDir = join(projectRoot, 'frontend');
const frontendNodeModules = join(frontendDir, 'node_modules');

if (!existsSync(frontendNodeModules)) {
  console.log('   Installing frontend dependencies...');
  try {
    if (packageManagerInstaller === 'pnpm') {
      execSync('pnpm install', { cwd: frontendDir, stdio: 'inherit' });
    } else {
      execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
    }
    console.log('✅ Frontend dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install frontend dependencies');
    console.error('💡 Check frontend/package.json and your npm/pnpm installation');
    process.exit(1);
  }
} else {
  console.log('✅ Frontend dependencies already installed');
}

console.log('');
console.log('🎉 Setup complete! 🎉');
console.log('');
console.log('📋 Next steps:');
console.log('   1. Run: npm run dev (or node scripts/dev.js)');
console.log('   2. Open backend: http://localhost:8000');
console.log('   3. Open frontend: http://localhost:5173');
console.log('');
console.log('💡 Available commands:');
console.log('   npm run dev        # Start development environment');
console.log('   npm run backend    # Start only backend');
console.log('   npm run frontend   # Start only frontend');
console.log('   npm run build      # Build for production');
console.log('   npm run clean      # Clean all dependencies');
console.log('');
console.log('📚 For more info, see docs/GETTING_STARTED.md');