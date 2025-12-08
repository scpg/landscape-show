# Getting Started with Landscape Show

## Current Status: Phase 2 Complete! ✅

The visualization canvas with drag-and-drop is live, and YAML files use the separated, user-friendly schema shown in `backend/data/examples/sample-new-format.yaml`.

## What's Working

✅ **Backend (Python + FastAPI)**
- Running on: http://localhost:8000
- API documentation: http://localhost:8000/docs
- Health check: http://localhost:8000/health
- Landscapes API: http://localhost:8000/api/landscapes

✅ **Frontend (React + TypeScript + React Flow)**
- Running on: http://localhost:5173
- Interactive diagram canvas with drag-and-drop and auto-save
- API integration working

✅ **Sample Data (Separated Schema)**
- New-format sample: `backend/data/examples/sample-new-format.yaml`
- Uses `systems`, `systems-positions`, `systems-styles`, `connections`, and optional `groups`

## Quick Commands

### 🚀 Simplest Way (Recommended)

**One-command startup (both services):**
```bash
npm run dev
```

**Platform-specific alternatives:**
```bash
./dev.sh      # Unix/Linux/macOS
dev.bat       # Windows
```

**First-time setup:**
```bash
npm run setup
```

### Manual Commands (if needed)

**Terminal 1 - Backend:**
```bash
cd backend
PYTHONPATH=/path/to/landscape-show/backend .venv/bin/python -m app.main
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

**Access the application:**
- Backend API: http://localhost:8000
- Frontend: http://localhost:5173

### Using uv for Backend

```bash
cd backend

# Create virtual environment (already done)
uv venv

# Activate virtual environment
source .venv/bin/activate  # On Unix/WSL
# or
.venv\Scripts\activate  # On Windows

# Install dependencies
uv pip install -r requirements.txt

# Run the app
PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend python -m app.main
```

## Project Structure

```
landscape-show/
├── backend/           # Python FastAPI backend
│   ├── .venv/         # Virtual environment
│   ├── app/
│   │   ├── models/    # Pydantic models ✅
│   │   ├── services/  # Business logic ✅
│   │   ├── api/       # API routes ✅
│   │   └── main.py    # FastAPI app ✅
│   └── data/          # YAML files
│       ├── sample-landscape.yaml ✅
│       └── examples/
│
├── frontend/          # React frontend
│   ├── node_modules/  # Dependencies
│   ├── src/
│   │   ├── components/
│   │   ├── stores/    # Zustand state ✅
│   │   ├── services/  # API client ✅
│   │   ├── types/     # TypeScript types ✅
│   │   └── App.tsx    # Main component ✅
│   └── package.json
│
└── docs/             # Documentation ✅
```

## Test the API

```bash
# List landscapes
curl http://localhost:8000/api/landscapes

# Get a specific landscape
curl http://localhost:8000/api/landscapes/sample-landscape

# Health check
curl http://localhost:8000/health
```

## View in Browser

1. **Open the frontend:** http://localhost:5173
2. You should see "Landscape Show" with the sample landscape
3. Click "Company System Landscape" to load the sample data
4. You'll see:
   - 8 systems (CRM, Billing, Inventory, Database, Analytics, Payment Gateway)
   - 7 connections between them

## Next Steps

### Phase 2: Core Visualization (Next)
- [ ] Implement React Flow canvas
- [ ] Create custom node components for systems
- [ ] Add drag-and-drop positioning
- [ ] Convert YAML to React Flow format

### Phase 3: YAML Editor
- [ ] Add Monaco Editor
- [ ] Real-time YAML editing
- [ ] Validation and error highlighting

### Phase 4: Bidirectional Sync
- [ ] Sync drag-and-drop changes back to YAML
- [ ] Auto-save functionality

### Phase 5: Export
- [ ] PDF export
- [ ] PNG export
- [ ] SVG export

## Creating Your Own Landscapes

1. Create a new YAML file in `backend/data/`:
   ```bash
   cd backend/data
   cp examples/sample-landscape.yaml my-landscape.yaml
   ```

2. Edit `my-landscape.yaml` following the [YAML Schema Guide](docs/yaml-schema.md)

3. Refresh the frontend - your new landscape will appear automatically!

## Troubleshooting

### Backend Issues

**Problem: "ModuleNotFoundError: No module named 'app'"**
- Solution: Always set PYTHONPATH when running:
  ```bash
  PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend python -m app.main
  ```

**Problem: Port 8000 already in use**
- Solution: Kill the existing process or change the port in `app/config.py`

### Frontend Issues

**Problem: Can't connect to backend**
- Make sure backend is running on port 8000
- Check the proxy settings in `vite.config.ts`

**Problem: "Cannot find module"**
- Run: `pnpm install`

## Development Tips

### Backend Development
- Changes are auto-reloaded (Uvicorn --reload)
- Add new API endpoints in `app/api/routes/`
- Modify data models in `app/models/landscape.py`

### Frontend Development
- Changes are auto-reloaded (Vite HMR)
- Add new components in `src/components/`
- Modify state in `src/stores/landscapeStore.ts`

## Documentation

- **README.md** - Project overview
- **docs/yaml-schema.md** - Complete YAML schema reference with examples
- **docs/deployment.md** - Deployment guide for production

## Current Limitations

- YAML editor improvements (Monaco split view) are in progress (Phase 3)
- Export functionality planned (Phase 5)

## Need Help?

- Check the [YAML Schema Documentation](docs/yaml-schema.md)
- Review the [Deployment Guide](docs/deployment.md)
- Look at the sample landscape: `backend/data/examples/sample-landscape.yaml`
- API docs: http://localhost:8000/docs

## What's Next?

The foundation is solid! Now we can build:
1. **React Flow integration** for interactive diagrams
2. **Monaco Editor** for YAML editing
3. **Bidirectional sync** between visual and code
4. **Export** to PDF/PNG/SVG
5. **Auto-layout** algorithms

Ready to continue to Phase 2? Let me know!
