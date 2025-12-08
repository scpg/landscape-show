# Contributing to Landscape Show

Thank you for your interest in contributing to Landscape Show! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Documentation](#documentation)

## 🚀 Getting Started

### Prerequisites

- **Python 3.12+** with uv (preferred) or pip
- **Node.js 18+** with npm
- **Git** for version control
- A code editor (VS Code recommended)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/landscape-show.git
   cd landscape-show
   ```

2. **Backend setup**
   ```bash
   cd backend
   uv venv
   uv pip install -r requirements-dev.txt
   ```

3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Start development servers**

   Terminal 1 (Backend):
   ```bash
   cd backend
   PYTHONPATH=/path/to/landscape-show/backend .venv/bin/python -m app.main
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Verify setup**
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:5173

## 📁 Project Structure

See [docs/FILE_INDEX.md](../docs/FILE_INDEX.md) for complete file map.

### Key Directories

```
landscape-show/
├── backend/        # Python FastAPI backend
├── frontend/       # React TypeScript frontend
├── docs/           # User documentation
├── .github/        # GitHub configuration
└── docker/         # Docker deployment (future)
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Changes

Follow our [code style guidelines](#code-style) and keep changes focused.

### 3. Test Your Changes

**Backend:**
```bash
cd backend
pytest tests/  # When tests are implemented
```

**Frontend:**
```bash
cd frontend
npm run lint
npm run build  # Verify build works
```

**Manual testing:**
- Test in browser at http://localhost:5173
- Verify API at http://localhost:8000/docs

### 4. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add YAML editor with Monaco"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎨 Code Style

### Python (Backend)

- Follow **PEP 8** style guide
- Use **type hints** for all functions
- Use **async/await** for I/O operations
- **Pydantic models** for data validation
- Maximum line length: **88 characters** (Black default)

**Example:**
```python
async def get_landscape(landscape_id: str) -> Landscape:
    """Get a landscape by ID with proper typing."""
    content = await file_service.read_landscape(landscape_id)
    return YAMLService.parse_yaml(content)
```

**Formatting:**
```bash
black backend/app/
flake8 backend/app/
mypy backend/app/
```

### TypeScript (Frontend)

- Use **strict TypeScript mode**
- **Functional components** with hooks
- **Proper typing** for all props and state
- Use **Zustand** for global state
- Follow **React best practices**

**Example:**
```typescript
interface SystemNodeProps {
  data: {
    label: string;
    system: System;
    color: string;
  };
  selected?: boolean;
}

export function SystemNode({ data, selected }: SystemNodeProps) {
  // Component implementation
}
```

**Formatting:**
```bash
npm run lint
npm run format  # If configured
```

### General Guidelines

- **Clear variable names** - descriptive, not abbreviated
- **Small functions** - single responsibility
- **Comments** - explain "why", not "what"
- **Error handling** - specific exceptions, proper logging
- **No hardcoded values** - use constants or config

## 🧪 Testing

### Backend Tests

Create tests in `backend/tests/`:

```python
# backend/tests/test_yaml_service.py
import pytest
from app.services.yaml_service import YAMLService

def test_parse_valid_yaml():
    yaml_content = """
    metadata:
      title: "Test"
    systems: []
    connections: []
    """
    landscape = YAMLService.parse_yaml(yaml_content)
    assert landscape.metadata.title == "Test"
```

### Frontend Tests

Create tests alongside components:

```typescript
// frontend/src/components/__tests__/CustomNode.test.tsx
import { render } from '@testing-library/react';
import CustomNode from '../DiagramCanvas/CustomNode';

test('renders system node', () => {
  const { getByText } = render(<CustomNode data={{...}} />);
  expect(getByText('CRM System')).toBeInTheDocument();
});
```

## 📝 Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated (if needed)
- [ ] CLAUDE.md updated (if architecture changed)
- [ ] docs/FILE_INDEX.md updated (if files added/changed)
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed

## Documentation
- [ ] Updated relevant documentation
- [ ] Updated CLAUDE.md (if needed)
- [ ] Updated docs/FILE_INDEX.md (if needed)

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process

1. Create PR with clear description
2. Wait for automated checks to pass
3. Request review from maintainers
4. Address feedback and update PR
5. Once approved, maintainer will merge

## 📚 Documentation

### When to Update Documentation

Update documentation when:

- **Adding new features** → Update README.md, CLAUDE.md
- **Changing architecture** → Update CLAUDE.md, docs/FILE_INDEX.md
- **Adding new files** → Update docs/FILE_INDEX.md
- **Changing API** → Update CLAUDE.md, API docs
- **Changing YAML schema** → Update docs/yaml-schema.md
- **Completing phases** → Create PHASE_X_COMPLETE.md

### Documentation Files

| File | Purpose | When to Update |
|------|---------|----------------|
| README.md | Project overview | Major features, setup changes |
| CLAUDE.md | Technical reference | Architecture, API, file changes |
| docs/FILE_INDEX.md | File map | New files, purpose changes |
| docs/yaml-schema.md | YAML reference | Schema changes |
| PHASE_X_COMPLETE.md | Phase documentation | Phase completion |

### Documentation Standards

- Use **clear, concise language**
- Include **code examples** where helpful
- Keep **consistent formatting**
- Add **links** between related docs
- Update **"Last Updated"** dates

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test with latest version

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11, Ubuntu 22.04]
- Python version: [e.g., 3.12]
- Node version: [e.g., 18.17]
- Browser: [e.g., Chrome 120]

## Screenshots
If applicable

## Logs
Relevant error messages or logs
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Solution
How would you implement this?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## 🏆 Recognition

Contributors will be:
- Listed in repository contributors
- Mentioned in release notes
- Credited in commit co-authorship

## 📞 Getting Help

- **Documentation:** Start with [docs/DOCUMENTATION_INDEX.md](../docs/DOCUMENTATION_INDEX.md)
- **Technical details:** See [CLAUDE.md](../CLAUDE.md)
- **Setup issues:** Check [docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md)
- **Questions:** Open a GitHub Discussion
- **Bugs:** Open a GitHub Issue

## 📋 Useful Commands

### Backend
```bash
# Run server
PYTHONPATH=/path/to/backend python -m app.main

# Run tests
pytest backend/tests/

# Format code
black backend/app/

# Type checking
mypy backend/app/
```

### Frontend
```bash
# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check  # If configured
```

### Git
```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit with conventional commits
git commit -m "feat: add new feature"

# Update from main
git pull origin main --rebase

# Push branch
git push origin feature/my-feature
```

## 🎯 Current Development Status

**Completed:**
- ✅ Phase 1: Foundation
- ✅ Phase 2: Core Visualization

**In Progress:**
- 🚧 Phase 3: YAML Editor

**Planned:**
- ⏳ Phase 4: Enhanced Sync
- ⏳ Phase 5: Export Functionality
- ⏳ Phase 6: UX Enhancements
- ⏳ Phase 7: Deployment

See [README.md](../README.md) for complete roadmap.

---

Thank you for contributing to Landscape Show! 🎉
