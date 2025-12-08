# Script Testing Guide

## 🎯 Testing Overview

This document provides comprehensive testing procedures for all development scripts to ensure they work reliably across different environments and scenarios.

## 🤖 Automated Testing

### Quick Test
Run the automated test suite:

```bash
node scripts/test-scripts.js
```

This tests:
- ✅ Prerequisite detection (Node.js, Python)
- ✅ Script existence and permissions  
- ✅ Clean environment setup
- ✅ Idempotent behavior (repeated runs)
- ✅ Partial state handling
- ✅ npm script syntax validation
- ✅ Shell script syntax validation

**Expected output:**
```
🧪 Testing Landscape Show development scripts...

📋 Node.js detection... ✅ PASS
📋 Python detection... ✅ PASS
📋 Clean environment setup... ✅ PASS
📋 Package.json scripts exist... ✅ PASS
[... more tests ...]

📊 Test Results: 12/12 passed
✅ All script tests passed! 🎉
```

## 📋 Manual Testing Checklist

### Prerequisites Test
Run these commands to verify your environment:

```bash
# Check required tools
node --version     # Should show v18.0.0+
python3 --version  # Should show 3.12.0+ (or python --version on Windows)
npm --version      # Should show 8.0.0+

# Check optional tools
pnpm --version     # Should show version or "command not found"
uv --version       # Should show version or "command not found"
```

### 1. Clean Environment Test (Most Important)

**Purpose:** Test first-time setup experience

```bash
# Step 1: Clean everything
rm -rf node_modules frontend/node_modules backend/.venv package-lock.json

# Step 2: Run setup
npm run setup
# ✅ Should complete without errors
# ✅ Should create node_modules, frontend/node_modules, backend/.venv
# ✅ Should take 30-60 seconds

# Step 3: Verify development startup  
npm run dev
# ✅ Should start both backend and frontend
# ✅ Should show URLs: http://localhost:8000 and http://localhost:5173
# ✅ Should start in under 10 seconds

# Step 4: Stop and test again
# Press Ctrl+C to stop
npm run dev
# ✅ Should start even faster (under 5 seconds)
```

### 2. Idempotent Behavior Test

**Purpose:** Test that scripts handle existing installations correctly

```bash
# After step 1 above, run setup again
npm run setup
# ✅ Should complete quickly (under 10 seconds) 
# ✅ Should show "✅ already installed" messages
# ✅ Should NOT reinstall anything
```

### 3. Partial State Recovery Test

**Purpose:** Test recovery from interrupted setups

```bash
# Test A: Missing root dependencies
rm -rf node_modules
npm run setup
# ✅ Should only reinstall root dependencies
# ✅ Should skip frontend and backend (already exist)

# Test B: Missing frontend dependencies  
rm -rf frontend/node_modules
npm run setup
# ✅ Should only reinstall frontend dependencies
# ✅ Should skip root and backend

# Test C: Missing backend environment
rm -rf backend/.venv  
npm run setup
# ✅ Should only recreate backend environment
# ✅ Should skip root and frontend
```

### 4. Platform-Specific Script Test

**Unix/Linux/macOS:**
```bash
# Test shell scripts directly
./setup.sh
# ✅ Should work identically to npm run setup

./dev.sh  
# ✅ Should work identically to npm run dev
# ✅ Should include prerequisite checking
```

**Windows:**
```cmd
REM Test batch scripts directly
setup.bat
REM ✅ Should work identically to npm run setup

dev.bat
REM ✅ Should work identically to npm run dev  
REM ✅ Should include prerequisite checking
```

### 5. Error Handling Test

**Purpose:** Test graceful failure and helpful error messages

```bash
# Test missing Python (temporary rename)
mv /usr/bin/python3 /usr/bin/python3.bak  # Unix
# or rename python.exe on Windows

npm run setup
# ✅ Should show clear error: "❌ Python not found"
# ✅ Should suggest installation instructions
# ✅ Should NOT create broken environments

# Restore Python
mv /usr/bin/python3.bak /usr/bin/python3  # Unix
```

### 6. Individual Script Test

**Purpose:** Test each script component independently

```bash
# Test individual npm scripts
npm run setup:backend
# ✅ Should set up only backend

npm run setup:frontend  
# ✅ Should set up only frontend

npm run backend
# ✅ Should start only backend (port 8000)

npm run frontend
# ✅ Should start only frontend (port 5173)

npm run clean
# ✅ Should remove all dependencies safely
```

### 7. Performance Test

**Purpose:** Verify scripts are reasonably fast

```bash
# Time the setup process
time npm run setup  # After clean environment
# ✅ First run: 30-90 seconds (depending on network)

time npm run setup  # With everything already installed  
# ✅ Repeat run: under 10 seconds

time npm run dev    # After setup complete
# ✅ Development start: under 10 seconds
```

## 🔧 Troubleshooting Tests

### Common Issues to Test For

1. **Permission Issues (Unix)**
```bash
# Verify scripts are executable
ls -la *.sh
# ✅ Should show -rwxr-xr-x (executable permissions)

# Test if scripts can run
./dev.sh --help 2>&1 | head -1
# ✅ Should NOT show "Permission denied"
```

2. **Path Issues (Windows)**
```cmd
REM Test batch file execution
echo %PATH% | findstr npm
REM ✅ Should show npm in PATH

where python
REM ✅ Should show python.exe location
```

3. **Environment Variable Issues**
```bash
# Test PYTHONPATH handling
npm run backend &
sleep 5
curl http://localhost:8000/health
# ✅ Should return JSON health response
# ✅ Should NOT show Python module import errors
```

## 📊 Test Results Validation

### Success Criteria

**✅ All tests pass if:**
- Automated test suite shows "All script tests passed!"
- Clean environment setup completes successfully  
- Repeated setup runs complete quickly (under 10 seconds)
- Development servers start and respond correctly
- Platform-specific scripts work identically to npm scripts
- Error messages are clear and actionable
- Performance is acceptable (setup <90s, dev start <10s)

### Failure Investigation

**❌ If tests fail:**

1. **Check prerequisites**
   ```bash
   node --version && python3 --version && npm --version
   ```

2. **Review error messages**
   - Look for "❌" messages in script output
   - Check if missing global dependencies (pnpm, python, etc.)

3. **Check file permissions**
   ```bash
   ls -la *.sh scripts/*.js  # Unix
   dir *.bat               # Windows
   ```

4. **Test individual components**
   ```bash
   npm run setup:backend   # Test backend setup alone
   npm run setup:frontend  # Test frontend setup alone
   ```

5. **Clean and retry**
   ```bash
   rm -rf node_modules frontend/node_modules backend/.venv
   npm run setup
   ```

## 🚀 CI/CD Testing

For automated testing in CI environments:

```bash
# Add to package.json scripts:
"test:scripts": "node scripts/test-scripts.js",
"test:integration": "npm run clean && npm run setup && npm run build"

# Use in GitHub Actions:
- name: Test Development Scripts
  run: |
    npm run test:scripts
    npm run test:integration
```

## 🏆 Expected Test Duration

| Test Type | First Run | Repeat Run |
|-----------|-----------|------------|
| Automated Suite | 30-60 seconds | 30-60 seconds |
| Manual Clean Setup | 30-90 seconds | N/A |
| Manual Idempotent | 5-10 seconds | 5-10 seconds |
| Manual Error Cases | 2-5 seconds | 2-5 seconds |
| **Total Manual Testing** | **~10 minutes** | **~5 minutes** |

---

## 📝 Test Report Template

After running tests, document results:

```markdown
## Test Report - [Date] - [Platform]

**Environment:**
- OS: [Windows 11 / macOS 13 / Ubuntu 22.04]
- Node.js: [version]
- Python: [version]  
- Additional tools: [pnpm version, uv version, etc.]

**Automated Tests:** [✅ PASS / ❌ FAIL]
**Clean Setup:** [✅ PASS / ❌ FAIL] 
**Idempotent Behavior:** [✅ PASS / ❌ FAIL]
**Platform Scripts:** [✅ PASS / ❌ FAIL]
**Error Handling:** [✅ PASS / ❌ FAIL]
**Performance:** [✅ PASS / ❌ FAIL]

**Notes:** [Any issues or observations]
**Recommendations:** [Any improvements needed]
```

This ensures scripts work reliably for all developers! 🎉