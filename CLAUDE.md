# Claude AI Coding Assistant Guidelines - Landscape Show



## Project Overview

**Landscape Show** is a self-hosted system landscape visualization tool that allows users to define system architectures in simple YAML format and visualize them with interactive drag-and-drop diagrams.

**Target Users:** Non-technical business users, system owners, architects
**Key Requirement:** Self-hosted, no external API calls (complete privacy)

## Technology Stack

### Backend
- **Python 3.12+** with FastAPI
- **Pydantic** for data validation and models
- **PyYAML** for YAML parsing
- **Uvicorn** as ASGI server
- **aiofiles** for async file operations
- **Playwright** for PDF/PNG export (future)

### Frontend
- **TypeScript** + **React 18** + **Vite**
- **React Flow 11** for interactive diagrams
- **Zustand** for state management
- **Axios** for API client
- **js-yaml** for YAML parsing client-side
- **Monaco Editor** (future Phase 3)

### Development Tools
- **uv** (preferred) or pip for Python dependencies
- **pnpm** for JavaScript dependencies (required for WSL environments)

## Project Structure

```
landscape-show/
├── backend/                 # Python FastAPI backend
│   ├── .venv/              # Virtual environment (created with uv)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI application entry
│   │   ├── config.py       # Settings with pydantic-settings
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── landscape.py         # Pydantic models (CRITICAL)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── yaml_service.py      # YAML parsing/serialization
│   │   │   ├── file_service.py      # File CRUD operations
│   │   │   └── export_service.py    # PDF/PNG export (future)
│   │   └── api/
│   │       ├── __init__.py
│   │       ├── routes/
│   │       │   ├── __init__.py
│   │       │   ├── landscapes.py    # Main CRUD endpoints
│   │       │   └── export.py        # Export endpoints (future)
│   │       └── websockets.py        # Real-time sync (future)
│   ├── data/               # YAML landscape files
│   │   ├── examples/
│   │   │   └── sample-landscape.yaml
│   │   └── *.yaml          # User landscape files
│   ├── tests/
│   ├── requirements.txt
│   └── requirements-dev.txt
│
├── frontend/               # React TypeScript frontend
│   ├── node_modules/
│   ├── src/
│   │   ├── main.tsx       # Entry point
│   │   ├── App.tsx        # Main app component
│   │   ├── components/
│   │   │   ├── DiagramCanvas/
│   │   │   │   ├── DiagramCanvas.tsx    # React Flow canvas (CRITICAL)
│   │   │   │   ├── CustomNode.tsx       # System node component
│   │   │   │   └── CustomEdge.tsx       # Connection edge component
│   │   │   ├── YamlEditor/              # (Phase 3 - future)
│   │   │   ├── ExportPanel/             # (Phase 5 - future)
│   │   │   └── Sidebar/                 # (Phase 6 - future)
│   │   ├── stores/
│   │   │   └── landscapeStore.ts        # Zustand state management
│   │   ├── services/
│   │   │   ├── api.ts                   # Axios API client
│   │   │   └── yamlParser.ts            # Client-side YAML parsing
│   │   ├── types/
│   │   │   └── landscape.ts             # TypeScript types (mirrors backend)
│   │   ├── utils/
│   │   │   ├── yamlToFlow.ts            # YAML → React Flow converter
│   │   │   └── flowToYaml.ts            # React Flow → YAML converter
│   │   └── styles/
│   │       └── index.css                # Global styles + React Flow styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── docker/                 # Docker deployment (future)
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── docs/                   # Documentation
│   ├── yaml-schema.md      # Complete YAML reference
│   └── deployment.md       # Deployment guide
│
├── README.md               # Project overview
├── GETTING_STARTED.md      # Quick start guide
├── PHASE2_COMPLETE.md      # Phase 2 completion details
└── CLAUDE.md              # This file - AI assistant guidelines
```

## Running the Application

### Backend
```bash
cd backend
# With virtual environment activated:
PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend .venv/bin/python -m app.main
# Or directly:
PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend python -m app.main
```
Backend runs on: http://localhost:8000
API docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
pnpm dev
```
Frontend runs on: http://localhost:5173

## YAML Schema

The core data format for landscapes:

```yaml
metadata:
  title: string (required)
  description: string (optional)
  version: string (default: "1.0")
  author: string (optional)
  last_updated: datetime (auto)

systems:
  - id: string (required, unique, lowercase-hyphenated)
    name: string (required)
    type: enum (required) # customer-facing, backend, database, external, integration, analytics
    description: string (optional)
    owner: string (optional)
    technology: string (optional)
    position: # required
      x: float
      y: float
    style: # optional
      color: string (hex)
      icon: string

connections:
  - from: string (required, system id)
    to: string (required, system id)
    label: string (optional)
    type: enum (required) # api, database, file-transfer, message-queue, manual, event
    description: string (optional)
    style: # optional
      lineStyle: enum # solid, dashed, dotted
      animated: boolean
      color: string (hex)

groups: # optional
  - id: string (required)
    name: string (required)
    systems: [string] (array of system ids)
    style: # optional
      backgroundColor: string (hex)
      borderColor: string (hex)
```

## API Endpoints

**Base URL:** http://localhost:8000/api

- `GET /landscapes` - List all landscapes
- `GET /landscapes/{id}` - Get landscape (returns YAML + parsed object)
- `POST /landscapes/{id}` - Create landscape (body: YAML text/plain)
- `PUT /landscapes/{id}` - Update landscape (body: YAML text/plain)
- `PATCH /landscapes/{id}/positions` - Update system positions
- `DELETE /landscapes/{id}` - Delete landscape
- `POST /landscapes/{id}/validate` - Validate YAML without saving

## Key Implementation Details

### Backend Models (Pydantic)

**Location:** `backend/app/models/landscape.py`

Core models:
- `Landscape` - Root model with metadata, systems, connections, groups
- `System` - Individual system with position and styling
- `Connection` - Connection between systems
- `Metadata` - Landscape metadata
- `Position` - X, Y coordinates
- `Style` - Visual styling options

Key validation:
- System IDs must be unique
- Connections must reference existing systems
- IDs are lowercase with hyphens/underscores only

### Frontend State Management

**Location:** `frontend/src/stores/landscapeStore.ts`

Zustand store with:
- `currentLandscape` - Currently loaded landscape
- `landscapes` - List of available landscapes
- `loadLandscapes()` - Fetch list from API
- `loadLandscape(id)` - Load specific landscape
- `updatePositions(id, updates)` - Save position changes

### React Flow Integration

**Location:** `frontend/src/components/DiagramCanvas/`

Custom node types:
- `customSystem` - System node with color-coding and metadata

Custom edge types:
- `customConnection` - Connection edge with labels and line styles

Key features:
- Drag-and-drop repositioning
- Auto-save on drag end
- Zoom/pan controls
- Mini-map navigation

### Data Flow

**YAML → Diagram:**
1. Load YAML from backend
2. Parse with Pydantic (backend) or js-yaml (frontend)
3. Convert to React Flow format with `yamlToFlow.ts`
4. Render nodes and edges

**Diagram → YAML:**
1. Capture position changes on drag end
2. Extract positions with `flowToYaml.ts`
3. Send PATCH request to `/landscapes/{id}/positions`
4. Backend updates YAML file

## Development Commands

### Backend

```bash
cd backend

# Create virtual environment
uv venv

# Install dependencies
uv pip install -r requirements.txt

# Install dev dependencies
uv pip install -r requirements-dev.txt

# Run server
PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend python -m app.main

# Run tests (when available)
pytest tests/
```

### Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

## Code Style Guidelines

### Backend (Python)
- Follow PEP 8
- Use type hints for all functions
- Pydantic models for data validation
- Async/await for I/O operations
- Error handling with specific exceptions
- Logging with appropriate levels

### Frontend (TypeScript)
- Strict TypeScript mode enabled
- React functional components with hooks
- Zustand for state management
- Proper typing for all props and state
- CSS-in-JS (inline styles) for components
- React Flow best practices

## Important Notes for AI Assistants

### Special directories 
1. directories named `errors-and-logs`
  * have to be used for storing temprary data associated only to development errors, logs, screenshots or any other file that might be needed for debugging or developing processes
  * the content of this directory will never be sent to github (with the exception of the `.gitkeep` file, this is defined so in the `.gitignore` file)
  * any temporary screenshot used during development needs to be placed here.

### When Modifying Backend

1. **Always validate with Pydantic** before writing YAML files
2. **Use async/await** for file operations
3. **Path sanitization** in file_service.py to prevent directory traversal
4. **PYTHONPATH must be set** when running: `PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend`
5. **Update last_updated** timestamp when modifying landscapes

### When Modifying Frontend

1. **Mirror backend types** in `frontend/src/types/landscape.ts`
2. **Use Zustand store** for all state management
3. **Import from @/** for relative paths (configured in tsconfig.json)
4. **React Flow node/edge types** must be registered in DiagramCanvas
5. **Position updates** should debounce or only fire on drag end

### Data Integrity

- **System IDs** must be unique and valid (lowercase, hyphens/underscores)
- **Connection references** must point to existing system IDs
- **Position coordinates** should be positive numbers
- **Colors** should be valid hex codes (e.g., #4A90E2)

### Testing

- **Manual testing:** Use sample-landscape.yaml
- **API testing:** Use http://localhost:8000/docs (Swagger UI)
- **Frontend testing:** Check browser console for errors
- **Backend testing:** Check uvicorn console output

## Current Implementation Status

### ✅ Phase 1: Foundation Setup (COMPLETE)
- Backend project structure
- Pydantic models and validation
- YAML parser and file service
- REST API endpoints
- Frontend project structure
- TypeScript types
- API client
- Zustand state management
- Basic UI

### ✅ Phase 2: Core Visualization (COMPLETE)
- React Flow integration
- Custom node components (system boxes)
- Custom edge components (connection lines)
- Drag-and-drop positioning
- Zoom/pan/minimap controls
- Position auto-save to backend
- YAML file updates on drag
- Color-coded system types
- Connection labels and line styles

### ⏳ Phase 3: YAML Editor (PLANNED)
- Monaco Editor integration
- Split view (Diagram | YAML)
- Real-time YAML editing
- Syntax highlighting
- Validation and error display
- Bidirectional sync (YAML edits → Diagram update)

### ⏳ Phase 4: Enhanced Sync (PLANNED)
- WebSocket support for real-time collaboration
- Undo/Redo functionality
- Conflict resolution

### ⏳ Phase 5: Export (PLANNED)
- SVG export (client-side)
- PNG export (server-side with Playwright)
- PDF export (server-side with Playwright)
- Export panel UI

### ⏳ Phase 6: UX Enhancements (PLANNED)
- Auto-layout with Dagre algorithm
- Properties panel for editing systems
- GUI-based system management
- Connection drawing tool
- System templates and icons
- Grouping visualization

### ⏳ Phase 7: Deployment (PLANNED)
- Docker multi-stage build
- docker-compose.yml
- Production build configuration
- User documentation
- Deployment guides

## Troubleshooting Common Issues

### Backend: "ModuleNotFoundError: No module named 'app'"
- Ensure PYTHONPATH is set: `PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend`
- Run from backend directory
- Use `-m app.main` instead of `app/main.py`

### Frontend: "Cannot find module '@/...'"
- Check tsconfig.json has correct path mapping
- Restart TypeScript server in IDE
- Verify vite.config.ts has alias configured

### React Flow: Nodes not appearing
- Check landscape data is loaded in Zustand store
- Verify `yamlToFlow` conversion is working
- Check node type is registered in nodeTypes
- Look for console errors

### CORS errors
- Backend must include frontend URL in CORS origins
- Check `app/config.py` - `cors_origins` setting
- Verify Vite proxy is configured in `vite.config.ts`

## Privacy & Security

- **No external API calls** - everything runs locally
- **File path sanitization** - prevents directory traversal
- **CORS configured** - only allows specified origins
- **No telemetry** - no tracking or analytics
- **Self-hosted** - complete data control

## Performance Considerations

- **Async file I/O** - non-blocking file operations
- **React Flow optimization** - memo components, efficient re-renders
- **Debounced updates** - position changes throttled
- **Mini-map** - overview without re-rendering full canvas

## Future Enhancements

See README.md for roadmap and feature planning.

## Documentation Files

- **README.md** - Project overview and status
- **GETTING_STARTED.md** - Quick start guide for users
- **PHASE2_COMPLETE.md** - Phase 2 feature documentation
- **docs/yaml-schema.md** - Complete YAML reference with examples
- **docs/deployment.md** - Production deployment guide
- **CLAUDE.md** (this file) - AI assistant guidelines

## Contact & Support

For questions about the codebase or architecture, refer to:
1. This CLAUDE.md file for technical details
2. docs/yaml-schema.md for YAML format
3. README.md for project overview
4. API documentation at http://localhost:8000/docs

---

**Last Updated:** 2025-12-05 
