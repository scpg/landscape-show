# Landscape Show - File Index & Architecture Reference

## Purpose
This document provides a complete map of all files in the project, their purpose, and how they interconnect. Use this as a reference for understanding the codebase structure.

---

## Documentation Files

| File | Purpose | AI Tool Reference |
|------|---------|-------------------|
| `README.md` | Project overview, features, and setup instructions | Primary project introduction |
| `CLAUDE.md` | Comprehensive guidelines for AI coding assistants | **CRITICAL - AI assistant reference** |
| `GETTING_STARTED.md` | Quick start guide for developers | User onboarding |
| `PHASE2_COMPLETE.md` | Phase 2 completion details and feature documentation | Feature reference |
| `FILE_INDEX.md` | This file - complete file map and architecture | Architecture reference |
| `docs/yaml-schema.md` | Complete YAML schema reference with examples | YAML format specification |
| `docs/deployment.md` | Production deployment guide | Deployment reference |

---

## Backend Files (Python/FastAPI)

### Core Application Files

| File Path | Purpose | Dependencies | Critical Points |
|-----------|---------|--------------|-----------------|
| `backend/app/main.py` | FastAPI application entry point, CORS setup, route registration | FastAPI, config, routes | Must set PYTHONPATH when running |
| `backend/app/config.py` | Application settings using pydantic-settings | pydantic-settings | CORS origins, data directory path |
| `backend/app/__init__.py` | Package initialization | - | Version number |

### Data Models (Pydantic)

| File Path | Purpose | Key Classes | Validation Rules |
|-----------|---------|-------------|------------------|
| `backend/app/models/landscape.py` | **CRITICAL** - All Pydantic data models | `Landscape`, `System`, `Connection`, `Metadata`, `Position`, `Style`, `Group` | System ID uniqueness, connection references, enum validation |
| `backend/app/models/__init__.py` | Model exports | - | All models exported here |

**Key Enums:**
- `SystemType`: customer-facing, backend, database, external, integration, analytics
- `ConnectionType`: api, database, file-transfer, message-queue, manual, event
- `LineStyle`: solid, dashed, dotted

### Services (Business Logic)

| File Path | Purpose | Key Methods | Notes |
|-----------|---------|-------------|-------|
| `backend/app/services/yaml_service.py` | YAML parsing and serialization | `parse_yaml()`, `serialize_to_yaml()`, `validate_yaml()`, `update_positions()` | Uses PyYAML, validates with Pydantic |
| `backend/app/services/file_service.py` | File CRUD operations | `list_landscapes()`, `read_landscape()`, `write_landscape()`, `update_positions()`, `delete_landscape()` | Async file I/O with aiofiles, path sanitization |
| `backend/app/services/export_service.py` | PDF/PNG/SVG export (future Phase 5) | - | Will use Playwright |
| `backend/app/services/__init__.py` | Service exports | - | - |

### API Routes

| File Path | Purpose | Endpoints | Request/Response |
|-----------|---------|-----------|------------------|
| `backend/app/api/routes/landscapes.py` | **CRITICAL** - Main CRUD endpoints | `GET /landscapes`, `GET /landscapes/{id}`, `POST /landscapes/{id}`, `PUT /landscapes/{id}`, `PATCH /landscapes/{id}/positions`, `DELETE /landscapes/{id}`, `POST /landscapes/{id}/validate` | Uses file_service and yaml_service |
| `backend/app/api/routes/export.py` | Export endpoints (future Phase 5) | - | Will handle PDF/PNG/SVG |
| `backend/app/api/routes/__init__.py` | Routes package | - | - |
| `backend/app/api/__init__.py` | API package | - | - |
| `backend/app/api/websockets.py` | WebSocket support (future Phase 4) | - | Real-time collaboration |

### Data Files

| File Path | Purpose | Format | Generated |
|-----------|---------|--------|-----------|
| `backend/data/*.yaml` | User landscape YAML files | YAML | User-created |
| `backend/data/examples/sample-landscape.yaml` | Sample landscape with 8 systems | YAML | Template/example |

### Configuration & Dependencies

| File Path | Purpose | Key Dependencies |
|-----------|---------|------------------|
| `backend/requirements.txt` | Python dependencies | fastapi, uvicorn, pydantic, pyyaml, playwright, websockets, aiofiles |
| `backend/requirements-dev.txt` | Development dependencies | pytest, black, flake8, mypy |
| `backend/.venv/` | Virtual environment (created with uv) | All installed packages |

---

## Frontend Files (TypeScript/React/Vite)

### Entry Points

| File Path | Purpose | Dependencies | Notes |
|-----------|---------|--------------|-------|
| `frontend/index.html` | HTML entry point | - | Loads main.tsx |
| `frontend/src/main.tsx` | React entry point | React, ReactDOM, App.tsx | Renders App component |
| `frontend/src/App.tsx` | **CRITICAL** - Main application component | DiagramCanvas, landscapeStore | Layout, routing, landscape selection |

### Components

#### DiagramCanvas (React Flow Integration)

| File Path | Purpose | Props | Key Features |
|-----------|---------|-------|--------------|
| `frontend/src/components/DiagramCanvas/DiagramCanvas.tsx` | **CRITICAL** - Main diagram canvas | `landscape`, `onPositionChange` | React Flow integration, custom node/edge types, zoom/pan/minimap |
| `frontend/src/components/DiagramCanvas/CustomNode.tsx` | Custom system node component | `data: {label, system, color}`, `selected` | Styled boxes with handles, color-coded |
| `frontend/src/components/DiagramCanvas/CustomEdge.tsx` | Custom connection edge component | EdgeProps from React Flow | Bezier paths, labels, line styles |

**Future Components (Planned):**
- `frontend/src/components/YamlEditor/YamlEditor.tsx` - Monaco Editor (Phase 3)
- `frontend/src/components/ExportPanel/ExportPanel.tsx` - Export UI (Phase 5)
- `frontend/src/components/Sidebar/SystemsList.tsx` - Systems management (Phase 6)
- `frontend/src/components/Sidebar/PropertiesPanel.tsx` - Properties editor (Phase 6)

### State Management

| File Path | Purpose | State | Actions |
|-----------|---------|-------|---------|
| `frontend/src/stores/landscapeStore.ts` | **CRITICAL** - Zustand store | `currentLandscape`, `landscapes`, `isLoading`, `error` | `loadLandscapes()`, `loadLandscape()`, `updatePositions()`, `saveLandscape()` |

**Store Pattern:**
- Uses Zustand for global state
- Integrates with API client
- Handles loading/error states
- Position updates trigger API calls

### Services

| File Path | Purpose | Key Methods | Notes |
|-----------|---------|-------------|-------|
| `frontend/src/services/api.ts` | **CRITICAL** - Axios API client | `listLandscapes()`, `getLandscape()`, `updateLandscape()`, `updatePositions()`, `deleteLandscape()`, `validateYaml()` | Singleton instance, base URL: `/api` |
| `frontend/src/services/yamlParser.ts` | Client-side YAML parsing | `parse()`, `stringify()`, `validate()` | Uses js-yaml library |

### TypeScript Types

| File Path | Purpose | Key Types | Mirrors Backend |
|-----------|---------|-----------|-----------------|
| `frontend/src/types/landscape.ts` | **CRITICAL** - All TypeScript types | `Landscape`, `System`, `Connection`, `Metadata`, `Position`, `Style`, `Group`, enums | Must match backend Pydantic models |

**Key Types:**
- `SystemType` enum - matches backend
- `ConnectionType` enum - matches backend
- `LineStyle` enum - matches backend
- All interfaces mirror Pydantic models

### Utilities

| File Path | Purpose | Key Functions | Data Flow |
|-----------|---------|---------------|-----------|
| `frontend/src/utils/yamlToFlow.ts` | **CRITICAL** - YAML → React Flow converter | `landscapeToFlow()`, `systemToNode()`, `connectionToEdge()`, `getSystemTypeColor()` | Converts Landscape to nodes/edges |
| `frontend/src/utils/flowToYaml.ts` | **CRITICAL** - React Flow → YAML converter | `extractPositionUpdates()`, `updateLandscapePositions()` | Extracts position changes for API |

**Conversion Flow:**
```
YAML File → Backend Parse → API Response → yamlToFlow → React Flow
React Flow Drag → flowToYaml → API Update → Backend Write → YAML File
```

### Styles

| File Path | Purpose | Key Styles | Notes |
|-----------|---------|------------|-------|
| `frontend/src/styles/index.css` | Global styles + React Flow customization | Base styles, React Flow overrides, custom cursors | Includes grab/grabbing cursors, minimap styling |

### Configuration

| File Path | Purpose | Key Settings |
|-----------|---------|--------------|
| `frontend/package.json` | npm dependencies and scripts | Dependencies: react, reactflow, zustand, axios, js-yaml, monaco-editor |
| `frontend/tsconfig.json` | TypeScript configuration | Path mapping (@/ → src/), strict mode |
| `frontend/tsconfig.node.json` | TypeScript config for Vite | Module resolution for Vite config |
| `frontend/vite.config.ts` | Vite build configuration | Proxy /api → http://localhost:8000, path aliases |

---

## Docker & Deployment (Future Phase 7)

| File Path | Purpose | Status |
|-----------|---------|--------|
| `docker/Dockerfile` | Multi-stage Docker build | Planned |
| `docker/docker-compose.yml` | Docker Compose configuration | Planned |

---

## Critical File Dependencies

### Data Flow Map

```
┌─────────────────┐
│  YAML File      │
│  (data/*.yaml)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Backend        │────►│  API Endpoints   │
│  YAMLService    │     │  landscapes.py   │
└─────────────────┘     └────────┬─────────┘
         ▲                       │
         │                       │ HTTP
         │                       ▼
┌─────────────────┐     ┌──────────────────┐
│  Backend        │     │  Frontend        │
│  FileService    │     │  API Client      │
└─────────────────┘     └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Zustand Store   │
                        │  landscapeStore  │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  yamlToFlow()    │
                        │  Converter       │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  DiagramCanvas   │
                        │  React Flow      │
                        └────────┬─────────┘
                                 │
                                 │ Drag Event
                                 ▼
                        ┌──────────────────┐
                        │  flowToYaml()    │
                        │  Position Update │
                        └──────────────────┘
```

### Import Dependencies

**Backend:**
```
main.py
  ├─ config.py
  ├─ api.routes.landscapes
  │   ├─ services.file_service
  │   │   ├─ services.yaml_service
  │   │   │   └─ models.landscape
  │   │   └─ models.landscape
  │   └─ models.landscape
  └─ fastapi, cors
```

**Frontend:**
```
main.tsx
  └─ App.tsx
      ├─ stores/landscapeStore.ts
      │   └─ services/api.ts
      ├─ components/DiagramCanvas/DiagramCanvas.tsx
      │   ├─ components/DiagramCanvas/CustomNode.tsx
      │   ├─ components/DiagramCanvas/CustomEdge.tsx
      │   ├─ utils/yamlToFlow.ts
      │   │   └─ types/landscape.ts
      │   ├─ utils/flowToYaml.ts
      │   │   └─ types/landscape.ts
      │   └─ reactflow
      └─ types/landscape.ts
```

---

## File Modification Guidelines

### When to Update Multiple Files

**Adding a new field to System:**
1. `backend/app/models/landscape.py` - Add Pydantic field
2. `frontend/src/types/landscape.ts` - Add TypeScript type
3. `backend/data/examples/sample-landscape.yaml` - Update example
4. `docs/yaml-schema.md` - Document new field
5. `frontend/src/components/DiagramCanvas/CustomNode.tsx` - Display if needed

**Adding a new API endpoint:**
1. `backend/app/api/routes/*.py` - Create endpoint
2. `frontend/src/services/api.ts` - Add client method
3. `frontend/src/stores/landscapeStore.ts` - Add action if needed
4. `README.md` - Document endpoint
5. `CLAUDE.md` - Update API reference

**Adding a new component:**
1. `frontend/src/components/*/ComponentName.tsx` - Create component
2. `App.tsx` or parent component - Import and use
3. `frontend/src/types/*.ts` - Add types if needed
4. `FILE_INDEX.md` - Document component (this file)
5. `CLAUDE.md` - Update architecture if significant

---

## Testing Strategy

### Backend Tests (when implemented)
- `backend/tests/test_yaml_service.py` - YAML parsing tests
- `backend/tests/test_file_service.py` - File operations tests
- `backend/tests/test_api.py` - API endpoint tests
- Run: `pytest backend/tests/`

### Frontend Tests (when implemented)
- Component tests with React Testing Library
- Integration tests for data flow
- E2E tests with Playwright
- Run: `npm test`

---

## Quick Reference: Most Important Files

### For Understanding Architecture
1. **`CLAUDE.md`** - Complete technical overview
2. **`backend/app/models/landscape.py`** - Data model definitions
3. **`frontend/src/types/landscape.ts`** - TypeScript type definitions
4. **`backend/app/api/routes/landscapes.py`** - API endpoints

### For Modifying Features
1. **`backend/app/services/yaml_service.py`** - YAML logic
2. **`frontend/src/stores/landscapeStore.ts`** - State management
3. **`frontend/src/components/DiagramCanvas/DiagramCanvas.tsx`** - Diagram UI
4. **`frontend/src/utils/yamlToFlow.ts`** - Data transformation

### For User Documentation
1. **`docs/yaml-schema.md`** - YAML format reference
2. **`GETTING_STARTED.md`** - Setup instructions
3. **`README.md`** - Project overview
4. **`PHASE2_COMPLETE.md`** - Feature documentation

---

## Current Implementation Status

| Phase | Status | Files Modified/Created |
|-------|--------|------------------------|
| Phase 1: Foundation | ✅ Complete | All backend files, frontend setup, basic UI |
| Phase 2: Visualization | ✅ Complete | DiagramCanvas components, utils, App.tsx |
| Phase 3: YAML Editor | ⏳ Planned | YamlEditor component (future) |
| Phase 4: Enhanced Sync | ⏳ Planned | WebSocket support (future) |
| Phase 5: Export | ⏳ Planned | ExportPanel, export_service (future) |
| Phase 6: UX Enhancements | ⏳ Planned | Sidebar components (future) |
| Phase 7: Deployment | ⏳ Planned | Docker files (future) |

---

## File Statistics

**Total Files (excluding node_modules, .venv):**
- Documentation: 7 files
- Backend Python: 14 files
- Frontend TypeScript: 13 files
- Configuration: 8 files
- **Total: ~42 core files**

**Lines of Code (approximate):**
- Backend: ~1,500 lines
- Frontend: ~1,200 lines
- Documentation: ~2,500 lines
- **Total: ~5,200 lines**

---

## Last Updated

**Date:** 2025-12-02
**Phase:** 2 Complete
**Version:** 0.1.0

---

This file index should be updated whenever:
- New files are added
- File purposes change significantly
- New phases are completed
- Architecture changes occur
