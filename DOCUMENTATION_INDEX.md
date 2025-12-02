# Documentation Index - Quick Reference Guide

This document helps you find the right documentation for your needs.

## 📚 Documentation Overview

| Document | Purpose | Primary Audience | When to Read |
|----------|---------|------------------|--------------|
| **[README.md](README.md)** | Project overview, features, setup | Everyone | First time viewing project |
| **[CLAUDE.md](CLAUDE.md)** | Technical reference for AI assistants | AI Tools, Developers | When modifying code or understanding architecture |
| **[FILE_INDEX.md](FILE_INDEX.md)** | Complete file map and architecture | Developers | When navigating codebase or adding features |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Quick start guide | New developers | First time setup |
| **[PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)** | Phase 2 feature documentation | Users, Developers | Understanding current features |
| **[docs/yaml-schema.md](docs/yaml-schema.md)** | YAML format specification | Users creating landscapes | Writing YAML files |
| **[docs/deployment.md](docs/deployment.md)** | Production deployment | DevOps, System Admins | Deploying to production |

---

## 🎯 Quick Navigation

### I Want To...

**...understand what this project does**
→ Read [README.md](README.md) first

**...set up the development environment**
→ Follow [GETTING_STARTED.md](GETTING_STARTED.md)

**...create a landscape YAML file**
→ Reference [docs/yaml-schema.md](docs/yaml-schema.md)

**...understand the code architecture**
→ Study [CLAUDE.md](CLAUDE.md) and [FILE_INDEX.md](FILE_INDEX.md)

**...find a specific file**
→ Search [FILE_INDEX.md](FILE_INDEX.md)

**...understand current features**
→ Read [PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)

**...deploy to production**
→ Follow [docs/deployment.md](docs/deployment.md)

**...modify the backend**
→ Check [CLAUDE.md](CLAUDE.md) → Backend section

**...modify the frontend**
→ Check [CLAUDE.md](CLAUDE.md) → Frontend section

**...add a new feature**
→ Review [CLAUDE.md](CLAUDE.md) and [FILE_INDEX.md](FILE_INDEX.md)

---

## 📖 Reading Order for New Developers

1. **[README.md](README.md)** - Get the big picture (10 min)
2. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Set up environment (15 min)
3. **[docs/yaml-schema.md](docs/yaml-schema.md)** - Understand data format (15 min)
4. **[PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)** - See what's working (10 min)
5. **[CLAUDE.md](CLAUDE.md)** - Deep dive into architecture (30 min)
6. **[FILE_INDEX.md](FILE_INDEX.md)** - Map the codebase (20 min)

**Total time:** ~1.5 hours to fully understand the project

---

## 🤖 For AI Coding Assistants

**Primary Reference:** [CLAUDE.md](CLAUDE.md)

This file contains:
- Complete technology stack
- Project structure with all file paths
- YAML schema specification
- API endpoints documentation
- Implementation guidelines
- Common troubleshooting
- Development commands
- Code style guidelines

**Secondary References:**
- [FILE_INDEX.md](FILE_INDEX.md) - File-by-file breakdown
- [docs/yaml-schema.md](docs/yaml-schema.md) - Detailed YAML reference

---

## 👥 For End Users

**Primary Reference:** [GETTING_STARTED.md](GETTING_STARTED.md)

**Creating Landscapes:** [docs/yaml-schema.md](docs/yaml-schema.md)

**Feature Documentation:** [PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)

---

## 🔧 For Developers

**Architecture Overview:** [CLAUDE.md](CLAUDE.md)

**File Navigation:** [FILE_INDEX.md](FILE_INDEX.md)

**Setup Instructions:** [GETTING_STARTED.md](GETTING_STARTED.md)

---

## 🚀 For DevOps/Deployment

**Primary Reference:** [docs/deployment.md](docs/deployment.md)

**Configuration:** [CLAUDE.md](CLAUDE.md) → Configuration section

---

## 📝 Documentation Maintenance

### When to Update Documentation

| Trigger | Update These Files |
|---------|-------------------|
| New feature added | README.md, CLAUDE.md, FILE_INDEX.md |
| New file created | FILE_INDEX.md, CLAUDE.md |
| YAML schema changed | docs/yaml-schema.md, CLAUDE.md |
| API endpoint added | README.md, CLAUDE.md |
| Phase completed | README.md, create PHASE_X_COMPLETE.md |
| Deployment process changed | docs/deployment.md |
| File purpose changed | FILE_INDEX.md |

### Documentation Standards

1. **Keep README.md updated** with current phase status
2. **CLAUDE.md is the source of truth** for technical details
3. **FILE_INDEX.md** must list all important files
4. **Use markdown consistently** for formatting
5. **Include code examples** where helpful
6. **Update "Last Updated" dates** when making changes

---

## 🔍 Search Tips

**Finding information:**
- Use your IDE's global search (Ctrl+Shift+F / Cmd+Shift+F)
- Search for specific terms across all .md files
- Check FILE_INDEX.md for file locations

**Common search terms:**
- "CRITICAL" - Important files and sections
- "Phase X" - Implementation status
- "TODO" or "future" - Planned features
- File paths - Find references to specific files

---

## 📊 Current Status Summary

**Completed:**
- ✅ Phase 1: Foundation Setup
- ✅ Phase 2: Core Visualization

**In Progress:**
- None

**Planned:**
- ⏳ Phase 3: YAML Editor
- ⏳ Phase 4: Enhanced Sync
- ⏳ Phase 5: Export Functionality
- ⏳ Phase 6: UX Enhancements
- ⏳ Phase 7: Deployment & Documentation

**Version:** 0.1.0
**Last Updated:** 2025-12-02

---

## 💡 Quick Tips

1. **Always read CLAUDE.md** before making significant changes
2. **Check FILE_INDEX.md** when looking for specific functionality
3. **Reference docs/yaml-schema.md** for data format questions
4. **Update documentation** when you add/modify features
5. **Keep this index current** as the project evolves

---

## 🆘 Need Help?

1. Check relevant documentation above
2. Search existing documentation
3. Review code comments in critical files
4. Check API docs: http://localhost:8000/docs
5. Review example file: `backend/data/examples/sample-landscape.yaml`

---

## 📧 Contributing to Documentation

When adding new documentation:
1. Follow existing markdown formatting
2. Update this index with new document
3. Add entry to FILE_INDEX.md if applicable
4. Update CLAUDE.md if technical changes
5. Cross-reference related documents
6. Include examples where helpful

---

**This documentation system ensures that all knowledge created is preserved and easily accessible.**
