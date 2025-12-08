#!/usr/bin/env node
/**
 * Automated script testing suite
 * Tests all development scripts in various scenarios
 */

import { execSync, spawn } from 'child_process';
import { existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🧪 Testing Landscape Show development scripts...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = [];

// Test helper functions
function test(name, testFn) {
  totalTests++;
  process.stdout.write(`📋 ${name}... `);
  
  try {
    testFn();
    console.log('✅ PASS');
    passedTests++;
  } catch (error) {
    console.log('❌ FAIL');
    console.log(`   Error: ${error.message}`);
    failedTests.push({ name, error: error.message });
  }
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

function fileExists(path) {
  return existsSync(join(projectRoot, path));
}

function cleanup() {
  console.log('🧹 Cleaning up test environment...');
  const pathsToClean = [
    'node_modules',
    'frontend/node_modules', 
    'backend/.venv',
    'package-lock.json'
  ];
  
  pathsToClean.forEach(path => {
    const fullPath = join(projectRoot, path);
    if (existsSync(fullPath)) {
      rmSync(fullPath, { recursive: true, force: true });
    }
  });
}

function createPartialState(missingItems) {
  console.log(`🎭 Creating partial state (missing: ${missingItems.join(', ')})...`);
  cleanup();
  
  // Create what should exist
  if (!missingItems.includes('root-deps')) {
    mkdirSync(join(projectRoot, 'node_modules'), { recursive: true });
    writeFileSync(join(projectRoot, 'node_modules', '.test'), 'test');
  }
  
  if (!missingItems.includes('frontend-deps')) {
    mkdirSync(join(projectRoot, 'frontend', 'node_modules'), { recursive: true });
    writeFileSync(join(projectRoot, 'frontend', 'node_modules', '.test'), 'test');
  }
  
  if (!missingItems.includes('backend-deps')) {
    mkdirSync(join(projectRoot, 'backend', '.venv'), { recursive: true });
    const binDir = process.platform === 'win32' ? 'Scripts' : 'bin';
    mkdirSync(join(projectRoot, 'backend', '.venv', binDir), { recursive: true });
    writeFileSync(join(projectRoot, 'backend', '.venv', binDir, 'python'), '#!/bin/bash\necho "fake python"');
  }
}

// Test suite
console.log('🔍 Testing prerequisite detection...');

test('Node.js detection', () => {
  const result = runCommand('node --version');
  if (!result.success) throw new Error('Node.js not detected');
});

test('Python detection', () => {
  const pythonCmd = process.platform === 'win32' ? 'python --version' : 'python3 --version';
  const result = runCommand(pythonCmd);
  if (!result.success) throw new Error('Python not detected');
});

console.log('\n🧹 Testing clean environment setup...');

test('Clean environment setup', () => {
  cleanup();
  
  if (fileExists('node_modules') || fileExists('frontend/node_modules') || fileExists('backend/.venv')) {
    throw new Error('Cleanup failed - files still exist');
  }
});

test('Package.json scripts exist', () => {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
  const requiredScripts = ['dev', 'setup', 'backend', 'frontend', 'setup:backend', 'setup:frontend'];
  
  for (const script of requiredScripts) {
    if (!packageJson.scripts[script]) {
      throw new Error(`Missing script: ${script}`);
    }
  }
});

test('Shell scripts exist and are executable', () => {
  const scripts = ['dev.sh', 'setup.sh', 'dev.bat', 'setup.bat'];
  
  for (const script of scripts) {
    if (!fileExists(script)) {
      throw new Error(`Missing script: ${script}`);
    }
  }
  
  // Test Unix script permissions (if not on Windows)
  if (process.platform !== 'win32') {
    const result = runCommand('test -x dev.sh && test -x setup.sh');
    if (!result.success) {
      throw new Error('Unix scripts are not executable');
    }
  }
});

console.log('\n⚙️ Testing setup functionality...');

test('npm run setup (clean install)', () => {
  cleanup();
  
  const result = runCommand('npm run setup', { stdio: 'pipe' });
  if (!result.success) {
    throw new Error(`Setup failed: ${result.error}`);
  }
  
  // Verify results
  if (!fileExists('node_modules')) throw new Error('Root dependencies not installed');
  if (!fileExists('frontend/node_modules')) throw new Error('Frontend dependencies not installed');
  if (!fileExists('backend/.venv')) throw new Error('Backend virtual environment not created');
});

test('npm run setup (idempotent - should skip existing)', () => {
  // Run setup again - should be fast and skip installation
  const startTime = Date.now();
  const result = runCommand('npm run setup', { stdio: 'pipe' });
  const duration = Date.now() - startTime;
  
  if (!result.success) {
    throw new Error(`Second setup failed: ${result.error}`);
  }
  
  if (duration > 10000) { // More than 10 seconds suggests reinstalling
    throw new Error(`Setup took too long (${duration}ms) - may not be skipping existing installations`);
  }
});

console.log('\n🎭 Testing partial state handling...');

test('Setup with missing root dependencies', () => {
  createPartialState(['root-deps']);
  
  const result = runCommand('npm run setup', { stdio: 'pipe' });
  if (!result.success) {
    throw new Error(`Setup with missing root deps failed: ${result.error}`);
  }
  
  if (!fileExists('node_modules')) throw new Error('Root dependencies not installed');
});

test('Setup with missing frontend dependencies', () => {
  createPartialState(['frontend-deps']);
  
  const result = runCommand('npm run setup', { stdio: 'pipe' });
  if (!result.success) {
    throw new Error(`Setup with missing frontend deps failed: ${result.error}`);
  }
  
  if (!fileExists('frontend/node_modules')) throw new Error('Frontend dependencies not installed');
});

test('Setup with missing backend dependencies', () => {
  createPartialState(['backend-deps']);
  
  const result = runCommand('npm run setup', { stdio: 'pipe' });
  if (!result.success) {
    throw new Error(`Setup with missing backend deps failed: ${result.error}`);
  }
  
  if (!fileExists('backend/.venv')) throw new Error('Backend virtual environment not created');
});

console.log('\n🚀 Testing development scripts...');

test('npm scripts syntax validation', () => {
  // Test that npm can parse all scripts without running them
  const result = runCommand('npm run --silent', { stdio: 'pipe' });
  if (!result.success) {
    throw new Error('npm scripts have syntax errors');
  }
});

console.log('\n🏁 Testing platform-specific scripts...');

if (process.platform !== 'win32') {
  test('Unix setup script syntax', () => {
    const result = runCommand('bash -n setup.sh');
    if (!result.success) {
      throw new Error('setup.sh has syntax errors');
    }
  });
  
  test('Unix dev script syntax', () => {
    const result = runCommand('bash -n dev.sh');
    if (!result.success) {
      throw new Error('dev.sh has syntax errors');
    }
  });
} else {
  console.log('ℹ️  Skipping Unix script tests on Windows platform');
}

// Final cleanup
cleanup();

// Results
console.log('\n' + '='.repeat(60));
console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);

if (failedTests.length > 0) {
  console.log('\n❌ Failed Tests:');
  failedTests.forEach(test => {
    console.log(`   • ${test.name}: ${test.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ All script tests passed! 🎉');
  console.log('\n💡 Next steps:');
  console.log('   1. Run manual testing checklist (see docs/SCRIPT_TESTING.md)');
  console.log('   2. Test on different platforms if possible');
  console.log('   3. Test with different Node/Python versions');
}

process.exit(0);