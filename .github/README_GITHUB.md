# GitHub Setup Instructions

This document explains how to use this project with GitHub effectively.

## 📂 Repository Structure

This repository follows a standard structure optimized for GitHub:

```
landscape-show/
├── .github/              # GitHub-specific files
│   ├── workflows/        # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   ├── pull_request_template.md
│   └── CONTRIBUTING.md   # Contribution guidelines
├── backend/              # Python backend
├── frontend/             # React frontend
├── docs/                 # Documentation
└── README.md            # Main project documentation
```

## 🚀 Getting Started with GitHub

### For Repository Owners

1. **Create Repository on GitHub**
   ```bash
   # After creating repo on GitHub
   git remote add origin https://github.com/YOUR_USERNAME/landscape-show.git
   git branch -M main
   git push -u origin main
   ```

2. **Configure Repository Settings**
   - Go to Settings → General
   - Enable: Issues, Projects, Wiki (optional)
   - Set default branch to `main`

3. **Enable GitHub Actions**
   - Go to Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

4. **Set up Branch Protection** (Recommended)
   - Go to Settings → Branches
   - Add rule for `main` branch:
     - ✅ Require pull request before merging
     - ✅ Require status checks to pass (CI)
     - ✅ Require conversation resolution
     - ✅ Do not allow bypassing

5. **Configure Secrets** (if needed for deployment)
   - Go to Settings → Secrets and variables → Actions
   - Add any deployment secrets

### For Contributors

1. **Fork the Repository**
   - Click "Fork" button on GitHub

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/landscape-show.git
   cd landscape-show
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/landscape-show.git
   ```

4. **Create Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

5. **Make Changes and Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/my-feature
   ```

6. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template
   - Submit for review

## 🔄 GitHub Actions Workflows

### CI Workflow

Located at `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
- **backend-tests**: Python linting, type checking, tests
- **frontend-tests**: TypeScript check, linting, build
- **integration-tests**: End-to-end API and build tests

**Status Badge:**
```markdown
![CI](https://github.com/YOUR_USERNAME/landscape-show/workflows/CI/badge.svg)
```

### Viewing Workflow Results

1. Go to "Actions" tab in your repository
2. Click on a workflow run to see details
3. Click on a job to see logs
4. Download artifacts if generated

## 📋 Using Issue Templates

### Bug Report

1. Go to Issues → New Issue
2. Select "Bug Report" template
3. Fill out all sections
4. Submit

**Good bug report includes:**
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Request

1. Go to Issues → New Issue
2. Select "Feature Request" template
3. Describe the feature and use case
4. Submit

## 🔍 Pull Request Process

### Creating a PR

1. **Ensure your branch is up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch**
   ```bash
   git push origin feature/my-feature
   ```

3. **Open PR on GitHub**
   - Go to your fork
   - Click "Compare & pull request"
   - Fill out the template completely

4. **Respond to feedback**
   - Make requested changes
   - Push updates to the same branch
   - PR will update automatically

### PR Checklist

Before requesting review, ensure:

- [ ] All CI checks pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] PR description is complete
- [ ] Screenshots added (if UI changes)

### Review Process

1. **Automated Checks**
   - CI workflow must pass
   - No linting errors
   - Build succeeds

2. **Code Review**
   - At least one approval required
   - All conversations resolved
   - No requested changes pending

3. **Merge**
   - Maintainer will merge using "Squash and merge"
   - Your commits will be combined with PR title as message

## 🏷️ Labels

Use labels to categorize issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on
- `duplicate` - Already exists
- `invalid` - Not relevant

## 📊 Project Board (Optional)

Set up a project board to track progress:

1. Go to Projects → New project
2. Choose "Board" template
3. Add columns: To Do, In Progress, Done
4. Link issues and PRs

## 🔔 Notifications

Configure notifications:

1. Go to repository page
2. Click "Watch" → Custom
3. Select events you want to be notified about:
   - ✅ Issues
   - ✅ Pull requests
   - ✅ Releases
   - ✅ Discussions

## 📦 Releases

### Creating a Release

1. **Tag the version**
   ```bash
   git tag -a v0.1.0 -m "Release version 0.1.0"
   git push origin v0.1.0
   ```

2. **Create Release on GitHub**
   - Go to Releases → Create a new release
   - Choose the tag
   - Fill in release notes
   - Attach binaries if applicable
   - Publish

### Release Notes Template

```markdown
## What's New

### Features
- Feature 1
- Feature 2

### Bug Fixes
- Fix 1
- Fix 2

### Documentation
- Updated docs

### Breaking Changes
- None

**Full Changelog**: https://github.com/.../compare/v0.0.1...v0.1.0
```

## 🔒 Security

### Reporting Security Issues

Do NOT create public issues for security vulnerabilities.

Instead:
1. Email maintainer directly
2. Or use GitHub Security tab → Report a vulnerability
3. Provide details privately
4. Wait for response before disclosure

## 📈 Insights and Analytics

View repository insights:

- **Traffic**: See visitor stats
- **Commits**: Contribution history
- **Contributors**: Who's contributing
- **Dependency graph**: Dependencies and dependents
- **Network**: Fork/branch visualization

## 🤝 Community Guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code of conduct
- Development workflow
- Code style guidelines
- Testing requirements
- Documentation standards

## 📚 Additional Resources

- **Main Documentation**: [README.md](../README.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Technical Reference**: [CLAUDE.md](../CLAUDE.md)
- **File Index**: [docs/FILE_INDEX.md](../docs/FILE_INDEX.md)
- **Getting Started**: [docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md)

## 💡 Tips

### For Maintainers

- Use issue templates consistently
- Label issues promptly
- Respond to PRs within 48 hours
- Keep CI green
- Update documentation with releases
- Thank contributors

### For Contributors

- Read CONTRIBUTING.md first
- Start with "good first issue" labels
- Ask questions in issues/discussions
- Keep PRs focused and small
- Write clear commit messages
- Be patient and respectful

---

**Questions?** Open a Discussion or Issue!
