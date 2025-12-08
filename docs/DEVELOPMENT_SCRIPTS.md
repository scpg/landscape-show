# Development Scripts Guide

## 🎯 Problem Solved

Before: Developers had to remember complex command sequences to start the application:
```bash
# Backend
cd backend
PYTHONPATH=/long/path/to/backend .venv/bin/python -m app.main

# Frontend (different terminal)
cd frontend
pnpm dev
```

After: Simple, standardized commands for everyone:
```bash
npm run dev    # Starts everything
npm run setup  # Sets up everything
```

## 🚀 Available Scripts

### Quick Development
```bash
npm run dev        # Start both backend and frontend
npm run setup      # Complete first-time setup
```

### Individual Services
```bash
npm run backend    # Start only backend
npm run frontend   # Start only frontend
```

### Maintenance
```bash
npm run test       # Run all tests
npm run build      # Build for production
npm run clean      # Clean all artifacts
```

### Platform-Specific Alternatives
```bash
./dev.sh           # Unix/Linux/macOS
dev.bat            # Windows
./setup.sh         # Unix/Linux/macOS setup
setup.bat          # Windows setup
```

## 🔧 Technical Implementation

### Root Package.json
- **Location**: `/package.json`
- **Purpose**: Orchestrates all development tasks
- **Dependencies**: `concurrently` (parallel execution), `cross-env` (cross-platform environment variables)

### Shell Scripts
- **dev.sh/dev.bat**: Platform-specific development startup
- **setup.sh/setup.bat**: Platform-specific first-time setup
- **Executable permissions**: Set automatically for Unix systems

### Cross-Platform Compatibility
- Uses `cross-env` for environment variable handling
- Separate `.sh` and `.bat` files for platform-specific optimizations
- npm scripts work on all platforms

## 🤖 AI Assistant Integration

The following files have been updated to inform AI assistants:

### CLAUDE.md
- Section 1.5 added with development scripts
- Clear instructions to ALWAYS use these scripts
- Complete list of available commands

### README.md
- Quick Start section prominently features new scripts
- Fallback to manual commands for advanced users

### docs/GETTING_STARTED.md
- Updated to prioritize script usage
- Manual commands retained for troubleshooting

## 📋 Developer Benefits

### For Non-Developers
✅ **Simple commands** - `npm run dev` starts everything
✅ **No path complexity** - Scripts handle PYTHONPATH automatically  
✅ **Cross-platform** - Works on Windows, Mac, Linux
✅ **One-time setup** - `npm run setup` does everything

### For Experienced Developers
✅ **Industry standard** - npm scripts are universally recognized
✅ **Parallel execution** - Backend and frontend start simultaneously
✅ **Customizable** - Easy to modify scripts for different environments
✅ **CI/CD friendly** - Scripts work in automated environments

### For AI Assistants
✅ **Discoverable** - AI tools automatically check package.json scripts
✅ **Documented** - Clear instructions in CLAUDE.md
✅ **Consistent** - Standardized commands across all AI interactions
✅ **Reliable** - Less prone to path and environment errors

## 🔄 Migration Path

### For Existing Developers
1. Old commands still work (documented as "Manual way")
2. New scripts are additive, not replacing
3. Documentation guides users to prefer scripts
4. Scripts handle edge cases and platform differences

### For New Developers
1. Clone repository
2. Run `npm run setup`
3. Run `npm run dev`
4. Start coding!

## 📈 Future Enhancements

Possible additions:
- `npm run docker` - Docker development environment
- `npm run lint` - Code quality checks
- `npm run docs` - Generate documentation
- `npm run deploy` - Deployment scripts
- `npm run backup` - Data backup scripts

## 🏆 Best Practices Followed

1. **Root-level scripts** (not `bin/` directory) - Industry standard
2. **Package.json scripts** - Cross-platform and AI-friendly  
3. **Parallel execution** - Efficient development workflow
4. **Error handling** - Scripts check prerequisites
5. **Documentation** - Multiple entry points for different users
6. **Fallback options** - Manual commands still available
7. **Platform support** - Windows, Mac, Linux compatibility

---

**Result**: Any developer (or AI assistant) can now start the entire development environment with a single, memorable command.