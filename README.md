# Landscape Show

A self-hosted system landscape visualization tool that combines simple YAML-based diagram definitions with interactive drag-and-drop positioning.

## Overview

Landscape Show allows you to create and visualize system architecture diagrams using a simple YAML format while providing a web-based GUI for positioning elements. It's designed for non-technical users who need to document system landscapes without the complexity of traditional diagramming tools.

### Key Features

- **Simple YAML Format**: Define systems and connections in an easy-to-understand declarative format
- **Drag-and-Drop Positioning**: Interactively position diagram elements using a visual editor
- **Bidirectional Sync**: Changes in the GUI update the YAML, and vice versa
- **Self-Hosted**: No external API calls - complete privacy and control
- **Export Capabilities**: Export diagrams to PDF, PNG, and SVG formats (coming soon)
- **Auto-Layout**: Automatic diagram layout with Dagre algorithm (coming soon)

## Technology Stack

### Backend
- **Python 3.10+** with FastAPI
- **Pydantic** for data validation
- **PyYAML** for YAML parsing
- **Uvicorn** as ASGI server

### Frontend
- **TypeScript** + **React** + **Vite**
- **React Flow** for interactive diagrams
- **Monaco Editor** for YAML editing (coming soon)
- **Zustand** for state management

## Quick Start

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- pnpm (recommended for WSL environments)

### Quick Start

**🚀 Universal commands (work on all platforms):**

```bash
# First time setup
npm run setup

# Start development environment  
npm run dev
```

**✅ Works on:** Windows (native + WSL), Ubuntu Linux, macOS

**Platform-specific alternatives:**
```bash
# Cross-platform Node.js scripts (recommended)
node scripts/setup.js    # Complete setup
node scripts/dev.js      # Development environment

# Legacy shell scripts (Unix/WSL only)  
./setup.sh               # Setup
./dev.sh                 # Development
```

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd landscape-show
   ```

2. **Run setup script**
   ```bash
   npm run setup              # Universal (recommended)
   node scripts/setup.js      # Direct Node.js script
   ./setup.sh                 # Unix/Linux/macOS/WSL only
   ```

### Running the Application

**Simple way (recommended):**
```bash
npm run dev              # Universal - starts both backend and frontend
node scripts/dev.js     # Direct Node.js script
```

**Platform-specific alternatives:**
```bash
./dev.sh                 # Unix/Linux/macOS/WSL only  
```

**Manual way:**
1. **Start the backend** (from the `backend` directory):
   ```bash
   PYTHONPATH=/path/to/landscape-show/backend python -m app.main
   ```

2. **Start the frontend** (from the `frontend` directory):
   ```bash
   pnpm dev
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

### Testing Scripts

Verify all scripts work correctly:

```bash
# Automated testing (local environment)
npm run test:scripts

# Docker testing (isolated environments) - RECOMMENDED
npm run test:docker

# Cross-platform compatibility
# See docs/CROSS_PLATFORM_GUIDE.md for platform-specific setup

# Testing guides
# See docs/SCRIPT_TESTING.md for comprehensive testing guide  
# See docs/DOCKER_TESTING.md for Docker testing guide
```

## YAML Schema

Create landscape diagrams using this simple YAML format:

```yaml
metadata:
  title: "Company System Landscape"
  description: "Overview of all systems"
  version: "1.0"

systems:
  - id: crm-system
    name: "CRM System"
    type: customer-facing
    description: "Customer relationship management"
    owner: "Sales Team"
    technology: "Salesforce"
    position:
      x: 100
      y: 100
    style:
      color: "#4A90E2"

connections:
  - from: crm-system
    to: billing-system
    label: "Customer Orders"
    type: api
    description: "REST API calls"
```

### System Types
- `customer-facing` - User-facing systems
- `backend` - Backend services
- `database` - Database systems
- `external` - External/third-party systems
- `integration` - Integration services
- `analytics` - Analytics platforms

### Connection Types
- `api` - REST/GraphQL APIs
- `database` - Direct database connections
- `file-transfer` - File-based transfers
- `message-queue` - Message queues (Kafka, RabbitMQ, etc.)
- `manual` - Manual processes
- `event` - Event-driven connections

## Project Structure

```
landscape-show/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── models/       # Pydantic models
│   │   ├── services/     # Business logic
│   │   ├── api/          # API routes
│   │   └── main.py       # FastAPI application
│   ├── data/             # YAML landscape files
│   └── requirements.txt
│
├── frontend/             # React TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── stores/       # Zustand stores
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── package.json
│
└── docs/                 # Documentation
```

## Development Status

### Phase 1: Foundation ✅ COMPLETED
- [x] Backend project structure
- [x] Pydantic models for YAML schema
- [x] YAML parser and validation
- [x] File service for CRUD operations
- [x] REST API endpoints
- [x] Frontend project structure
- [x] TypeScript types
- [x] API client
- [x] Basic UI

### Phase 2: Core Visualization ✅ COMPLETED
- [x] YAML to React Flow conversion
- [x] Interactive diagram canvas
- [x] Custom node components
- [x] Custom edge components
- [x] Drag-and-drop functionality
- [x] Auto-save positions to YAML
- [x] Zoom/pan/minimap controls
- [x] Color-coded system types

### Phase 3: YAML Editor (Planned)
- [ ] Monaco Editor integration
- [ ] YAML syntax highlighting
- [ ] Real-time validation
- [ ] Error highlighting

### Phase 4: Bidirectional Sync (Planned)
- [ ] Visual to YAML sync
- [ ] YAML to Visual sync
- [ ] Auto-save on changes
- [ ] WebSocket support (optional)

### Phase 5: Export (Planned)
- [ ] SVG export
- [ ] PNG export
- [ ] PDF export
- [ ] Export panel UI

### Phase 6: UX Enhancements (Planned)
- [ ] Auto-layout with Dagre
- [ ] Properties panel
- [ ] System management GUI
- [ ] Connection drawing tool

### Phase 7: Deployment (Planned)
- [ ] Docker packaging
- [ ] Docker Compose setup
- [ ] User documentation
- [ ] Deployment guide

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Main Endpoints

- `GET /api/landscapes` - List all landscapes
- `GET /api/landscapes/{id}` - Get a specific landscape
- `POST /api/landscapes/{id}` - Create a new landscape
- `PUT /api/landscapes/{id}` - Update a landscape
- `PATCH /api/landscapes/{id}/positions` - Update system positions
- `DELETE /api/landscapes/{id}` - Delete a landscape

## Privacy & Security

- **No External API Calls**: All processing happens locally
- **Self-Hosted**: Complete control over your data
- **No Telemetry**: No tracking or analytics
- **Offline-Capable**: Works without internet connection after initial load

## Contributing

This project is in active development. Contributions are welcome!

## License

[To be determined]

## Support

For questions or issues, please contact the development team.
