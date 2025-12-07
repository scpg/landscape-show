# AI Assistant General Guidelines - Landscape Show

## 1. Project Overview

**Landscape Show** is a self-hosted system landscape visualization tool. It allows users to define system architectures in a simple YAML format and visualize them with interactive drag-and-drop diagrams. The core feature is the bidirectional synchronization between the YAML text and the visual diagram.

*   **Target Users**: Non-technical business users, system owners, architects.
*   **Key Requirement**: Must be self-hosted with no external API calls to ensure data privacy.

## 2. Technology Stack

| Area      | Technology                                                               |
| :-------- | :----------------------------------------------------------------------- |
| **Backend** | Python 3.12+, FastAPI, Pydantic, PyYAML, Uvicorn, aiofiles                 |
| **Frontend**  | TypeScript, React 18, Vite, React Flow 11, Monaco Editor, Zustand, Axios, js-yaml |
| **Dev Tools** | `uv` (Python), `pnpm` (Node.js)                                          |

## 3. How to Run the Application

### Backend
*   **Directory**: `cd backend`
*   **Command**: `PYTHONPATH=/home/scpg/dev/landscape-show/backend python -m app.main`
*   **URL**: `http://localhost:8000`
*   **API Docs**: `http://localhost:8000/docs`

### Frontend
*   **Directory**: `cd frontend`
*   **Command**: `pnpm dev`
*   **URL**: `http://localhost:5173`

## 4. Project Structure

```
landscape-show/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── models/          # Pydantic models (landscape.py is critical)
│   │   ├── services/        # Business logic (yaml_service.py, file_service.py)
│   │   ├── api/             # API routes (landscapes.py)
│   │   └── main.py          # FastAPI application entry
│   └── data/                # User-created YAML landscape files live here
│
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── DiagramCanvas/ # React Flow components
│   │   │   └── YamlEditor/    # Monaco Editor component
│   │   ├── stores/          # Zustand state management (landscapeStore.ts)
│   │   ├── types/           # TypeScript types (landscape.ts)
│   │   ├── utils/           # Data transformers (yamlToFlow.ts, flowToYaml.ts)
│   │   └── App.tsx          # Main app component, handles sync logic
│   └── package.json
│
├── docs/                    # Documentation
│   └── yaml-schema.md       # The canonical YAML reference
└── AI.md                    # This file: General AI guidelines
```

## 5. YAML Schema

The core data format. See `docs/yaml-schema.md` for the complete reference.

```yaml
metadata:
  title: string (required)
systems:
  - id: string (required, unique, lowercase-hyphenated)
    name: string (required)
    type: enum (required)
    position: { x: float, y: float }
connections:
  - from: string (required, system id)
    to: string (required, system id)
```

## 6. API Endpoints

**Base URL:** `/api`

*   `GET /landscapes`: List all available landscape file IDs.
*   `GET /landscapes/{id}`: Get the content of a specific landscape.
*   `PUT /landscapes/{id}`: Overwrite a landscape file with new content. Used for saving from the editor.
*   `PATCH /landscapes/{id}/positions`: A special endpoint to only update the `position` of systems. Used for drag-and-drop saves.

## 7. Code Style and Project Conventions

*   **Model-First**: Data structure changes start in `docs/yaml-schema.md`, then cascade to Pydantic models (`backend/app/models/landscape.py`) and TypeScript types (`frontend/src/types/landscape.ts`).
*   **Service Pattern**: Backend logic is encapsulated in services (`backend/app/services/`).
*   **State Management**: All frontend state is managed via the Zustand store (`frontend/src/stores/landscapeStore.ts`).
*   **Validation is Key**: Pydantic models are the source of truth for backend validation. The frontend performs preliminary validation during YAML editing.
*   **Debugging Files**: Temporary files, screenshots, and logs created during development must be placed in the `errors-and-logs` directories. These are ignored by git.

## 8. Architectural Principle: API-Oriented Design
The application strictly follows a client-server architecture where the frontend is completely decoupled from the backend. All interactions that require data persistence, file modification, or access to backend business logic **must** be performed through the FastAPI REST API. The frontend should not assume any direct access to the backend's filesystem or data sources. This ensures a clean separation of concerns and a well-defined interface.

## 9. Project Status & Roadmap

The project is developed in phases. My analysis indicates the project is more advanced than the documentation suggests.

*   [✅] Phase 1: Foundation Setup
*   [✅] Phase 2: Core Visualization (React Flow, Diagram -> YAML sync)
*   [✅] Phase 3: YAML Editor (Monaco Editor, Split View)
*   [✅] Phase 4: Bidirectional Sync (YAML -> Diagram sync is implemented with a debounce)
*   [⏳] Phase 4 (Advanced): Real-time multi-user sync via WebSockets.
*   [⏳] Phase 5: Export (SVG, PNG)
*   [⏳] Phase 6: UX Enhancements (Auto-layout, Properties Panel)
*   [⏳] Phase 7: Deployment (Docker)

Your current task will likely be related to the next *uncompleted* phase.
