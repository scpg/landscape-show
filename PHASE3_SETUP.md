# Phase 3 Setup - YAML Editor with Monaco

## 🎯 Phase 3 Goals

Add Monaco Editor for live YAML editing with:
- Split-view layout (Diagram | YAML)
- Real-time YAML editing with syntax highlighting
- Schema-based validation
- Auto-completion
- Bidirectional sync (edit YAML → update diagram)

## ✅ Completed So Far

### GitHub Integration Files Created

1. **`.github/CONTRIBUTING.md`** ✅
   - Comprehensive contribution guidelines
   - Development workflow
   - Code style guidelines
   - Testing requirements
   - PR and commit conventions

2. **`.github/ISSUE_TEMPLATE/bug_report.md`** ✅
   - Bug report template with all necessary sections
   - Environment details
   - Reproduction steps

3. **`.github/ISSUE_TEMPLATE/feature_request.md`** ✅
   - Feature request template
   - Use cases and acceptance criteria
   - Priority levels

4. **`.github/pull_request_template.md`** ✅
   - Comprehensive PR template
   - Checklist for reviewers
   - Testing and documentation sections

5. **`.github/workflows/ci.yml`** ✅
   - Full CI/CD pipeline with GitHub Actions
   - Backend tests (Python, flake8, mypy, pytest)
   - Frontend tests (TypeScript, lint, build)
   - Integration tests
   - Artifact uploads

6. **`.github/README_GITHUB.md`** ✅
   - Complete GitHub setup instructions
   - Workflow documentation
   - Release process
   - Security guidelines

### Component Files Created

7. **`frontend/src/components/YamlEditor/YamlEditor.tsx`** ✅
   - Monaco Editor integration
   - YAML syntax highlighting
   - Schema-based validation
   - Auto-completion support
   - Real-time error reporting

## 📋 Next Steps

### Immediate Tasks

1. **Update App.tsx for Split View** 🚧
   - Add view toggle (Diagram | Split | YAML)
   - Implement split-pane layout
   - Add resize functionality
   - State management for view mode

2. **Implement Bidirectional Sync**
   - YAML editor changes → Parse → Update store → Diagram updates
   - Add debouncing for performance
   - Error handling and validation display

3. **Add Validation UI**
   - Error panel below editor
   - Inline error markers
   - Validation status indicator

4. **Update Store**
   - Add `yamlContent` to store
   - Add `updateYaml()` action
   - Sync between YAML and landscape object

5. **Testing**
   - Test YAML editing
   - Test diagram sync
   - Test validation
   - Test split view resizing

### Documentation Updates Needed

1. **Update CLAUDE.md**
   - Add Phase 3 implementation details
   - Document Monaco Editor integration
   - Update component architecture
   - Add split-view documentation

2. **Update FILE_INDEX.md**
   - Add YamlEditor component
   - Add GitHub workflow files
   - Update component relationships

3. **Update README.md**
   - Mark Phase 3 progress
   - Add Monaco Editor to tech stack
   - Update feature list

4. **Create PHASE3_COMPLETE.md**
   - Document all Phase 3 features
   - Usage instructions
   - Screenshots/examples

5. **Update DOCUMENTATION_INDEX.md**
   - Add new documentation files
   - Update navigation

## 🔧 Technical Details

### Monaco Editor Configuration

**Schema Validation:**
- Defined JSON schema for YAML structure
- Validates system types, connection types, required fields
- Provides auto-completion based on schema

**Features Enabled:**
- Syntax highlighting (YAML)
- Auto-completion
- Format on paste/type
- Mini-map
- Line numbers
- Word wrap

### Split View Layout Options

**Option 1: Horizontal Split**
```
┌────────────────┬────────────────┐
│                │                │
│   Diagram      │   YAML Editor  │
│   Canvas       │                │
│                │                │
└────────────────┴────────────────┘
```

**Option 2: Vertical Split**
```
┌──────────────────────────────────┐
│         Diagram Canvas           │
├──────────────────────────────────┤
│         YAML Editor              │
└──────────────────────────────────┘
```

**Option 3: Tabs**
```
┌──────────────────────────────────┐
│ [Diagram] [YAML] [Both]          │
├──────────────────────────────────┤
│                                   │
│         Active View               │
│                                   │
└──────────────────────────────────┘
```

**Recommended:** Option 1 (Horizontal Split) with resizable panes

### Data Flow for YAML Editing

```
User edits YAML
    ↓
Monaco onChange event
    ↓
Debounce (500ms)
    ↓
Validate YAML
    ↓
If valid:
    Parse YAML → Landscape object
    ↓
    Update store
    ↓
    yamlToFlow converter
    ↓
    Update React Flow nodes/edges
    ↓
    Diagram re-renders
If invalid:
    Show validation errors
    Keep previous diagram state
```

### Libraries Needed

**Already Installed:**
- ✅ `@monaco-editor/react@4.7.0`
- ✅ `monaco-editor@0.55.1`

**May Need:**
- `react-split` or `react-resizable-panels` for split view (optional)
- Already have all other dependencies

## 🎨 UI/UX Considerations

### View Toggle

Add buttons to switch between views:
- 📊 Diagram Only
- ⚡ Split View (default for Phase 3)
- 📝 YAML Only

### Validation Feedback

- ✅ Green checkmark when valid
- ❌ Red X with error count when invalid
- 💡 Yellow warning for non-critical issues
- Error panel below editor with line numbers

### Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S`: Save (triggers sync)
- `Ctrl+Shift+F`: Format YAML
- `Ctrl+F`: Find in YAML
- `Esc`: Close error panel

### Responsive Design

- On mobile: Stack views vertically
- On tablet: Side-by-side with smaller widths
- On desktop: Full split view

## 📊 Success Criteria

Phase 3 will be complete when:

- [ ] Split-view layout implemented
- [ ] Monaco Editor integrated
- [ ] YAML editing works with syntax highlighting
- [ ] Schema validation active
- [ ] Auto-completion working
- [ ] Bidirectional sync: YAML → Diagram
- [ ] Error display functional
- [ ] View toggle works
- [ ] Documentation updated
- [ ] GitHub files ready for collaboration

## 🚀 Estimated Timeline

- Setup & Integration: 30 min ✅ (Done)
- Split View Layout: 30 min 🚧 (Next)
- Bidirectional Sync: 45 min
- Validation UI: 30 min
- Testing & Polish: 30 min
- Documentation: 30 min

**Total: ~3 hours**

## 📝 Notes

- Monaco Editor already configured with YAML schema
- Validation happens in real-time
- Performance: Debounce updates to avoid lag
- UX: Show loading indicator during sync
- Error handling: Graceful degradation if YAML invalid

---

**Status:** Setup phase complete, ready for implementation
**Next:** Update App.tsx for split-view layout
