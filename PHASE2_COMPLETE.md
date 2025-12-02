# Phase 2 Complete: Core Visualization with React Flow

## 🎉 What's New

Phase 2 adds **interactive diagram visualization** to your landscape tool!

### ✅ Completed Features

1. **Interactive Diagram Canvas**
   - Powered by React Flow
   - Drag-and-drop system positioning
   - Zoom and pan controls
   - Mini-map for navigation

2. **Custom System Nodes**
   - Color-coded by system type
   - Shows system name, type, owner, and technology
   - Beautiful styling with hover effects
   - Connection handles on all sides

3. **Custom Connection Edges**
   - Different line styles (solid, dashed, dotted)
   - Labels showing connection type and description
   - Bezier curves for smooth paths
   - Optional animation

4. **Bidirectional Position Updates**
   - Drag nodes to reposition
   - Changes automatically save to backend
   - YAML file updated with new positions

## 🖼️ Visual Features

### System Nodes
- **Color-coded** based on system type:
  - 🔵 Customer-Facing: Blue (#4A90E2)
  - 🟠 Backend: Orange (#F39C12)
  - 🔷 Database: Navy (#336791)
  - 🟣 External: Purple (#6772E5)
  - 🟢 Integration: Green (#27AE60)
  - 🟣 Analytics: Deep Purple (#8E44AD)

### Connection Lines
- **Line Styles**:
  - Solid: Direct connections
  - Dashed: External/remote connections
  - Dotted: Asynchronous/queued connections
- **Labels**: Show connection name and type
- **Animation**: Optional animated flow

### Controls
- **Zoom**: Mouse wheel or control buttons
- **Pan**: Click and drag background
- **Mini-map**: Overview of entire diagram
- **Background**: Dotted grid for alignment

## 📂 New Files Created

### Components
- **[frontend/src/components/DiagramCanvas/DiagramCanvas.tsx](frontend/src/components/DiagramCanvas/DiagramCanvas.tsx)**
  - Main canvas component with React Flow integration
  - Handles node/edge state and updates
  - Position change callbacks

- **[frontend/src/components/DiagramCanvas/CustomNode.tsx](frontend/src/components/DiagramCanvas/CustomNode.tsx)**
  - Custom node component for systems
  - Styled with colors, borders, shadows
  - Shows system metadata

- **[frontend/src/components/DiagramCanvas/CustomEdge.tsx](frontend/src/components/DiagramCanvas/CustomEdge.tsx)**
  - Custom edge component for connections
  - Supports different line styles
  - Edge labels with connection info

### Utilities
- **[frontend/src/utils/yamlToFlow.ts](frontend/src/utils/yamlToFlow.ts)**
  - Converts YAML Landscape data to React Flow format
  - Maps systems to nodes
  - Maps connections to edges
  - Color mapping for system types

- **[frontend/src/utils/flowToYaml.ts](frontend/src/utils/flowToYaml.ts)**
  - Converts React Flow data back to YAML format
  - Extracts position updates from nodes
  - Updates Landscape object with new positions

## 🚀 How to Use

### 1. Start the Application

**Backend** (Terminal 1):
```bash
cd backend
PYTHONPATH=/mnt/c/dev/2025/landscape-show/backend .venv/bin/python -m app.main
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

### 2. Open in Browser

Visit: **http://localhost:5173**

### 3. View Your Landscape

1. Click "Company System Landscape" button
2. You'll see an interactive diagram with:
   - 8 system nodes (CRM, Billing, Inventory, etc.)
   - 7 connection lines between them
   - Color-coded by system type

### 4. Interact with the Diagram

**Drag nodes:**
- Click and drag any node to reposition it
- Release to auto-save the new position

**Zoom:**
- Use mouse wheel to zoom in/out
- Or use the + / - buttons in the controls

**Pan:**
- Click and drag the background to move around
- Or use the mini-map in the bottom-right

**Select nodes:**
- Click a node to select it (adds highlight)
- View connection paths more clearly

## 🔄 Auto-Save Feature

When you drag a node and release it:
1. Position is captured by React Flow
2. Update sent to backend API
3. YAML file automatically updated
4. New positions persisted

**Check it:** After dragging nodes, look at `backend/data/sample-landscape.yaml` - the `position` fields will be updated!

## 🎨 UI Layout

```
┌─────────────────────────────────────────────────┐
│ Header: "Landscape Show"                        │
├─────────────────────────────────────────────────┤
│ Landscape Selector: [Company System Landscape]  │
├─────────────────────────────────────────────────┤
│ ┌─────────────┐                                 │
│ │ Info Panel  │      Diagram Canvas             │
│ │  - Title    │                                 │
│ │  - Stats    │      [Interactive               │
│ │  - Hint     │       System Diagram]           │
│ └─────────────┘                                 │
│                                                  │
│                       ┌─────────┐                │
│                       │ MiniMap │                │
│                       └─────────┘                │
│                  [Zoom Controls]                 │
└─────────────────────────────────────────────────┘
```

## 🧪 Test the Features

### Test 1: Drag and Drop
1. Open http://localhost:5173
2. Click "Company System Landscape"
3. Drag the "CRM System" node to a new position
4. Check the backend log - you should see position update
5. Refresh the page - the node stays in the new position!

### Test 2: Zoom and Pan
1. Scroll mouse wheel to zoom in/out
2. Click and drag background to pan
3. Use mini-map to navigate
4. Click controls buttons (+, -, fit view, lock)

### Test 3: View Connections
1. Click on a node to select it
2. Observe the connections highlighting
3. Hover over connection labels
4. Notice different line styles (solid, dashed, dotted)

## 📊 Current System Landscape

The sample landscape includes:

**Systems:**
- CRM System (Customer-facing)
- Billing System (Backend)
- Inventory Management (Backend)
- Main Database (Database)
- Analytics Platform (Analytics)
- Payment Gateway (External)

**Connections:**
- CRM → Billing (API: Customer Orders)
- CRM → Database (Database: Customer Data)
- Billing → Database (Database: Store Invoices)
- Billing → Payment Gateway (API: Process Payments)
- Inventory → Database (Database: Product Data)
- Inventory → Billing (Message Queue: Stock Updates)
- Database → Analytics (Database: Data Replication)

## 🆕 What's Next?

### Phase 3: YAML Editor (Next)
- [ ] Monaco Editor integration
- [ ] Live YAML editing
- [ ] Split view: Diagram | YAML
- [ ] Real-time validation
- [ ] Syntax highlighting

### Phase 4: Enhanced Bidirectional Sync
- [x] Drag → Update YAML ✅ (Already working!)
- [ ] Edit YAML → Update Diagram
- [ ] Real-time sync with WebSocket
- [ ] Undo/Redo functionality

### Phase 5: Export Functionality
- [ ] Export to SVG
- [ ] Export to PNG
- [ ] Export to PDF
- [ ] Export panel UI

## 🐛 Troubleshooting

### Issue: Blank screen or "Cannot read property..."
**Solution:** Check browser console (F12) for errors. Most likely:
- Backend not running on port 8000
- CORS issue - check backend console

### Issue: Nodes don't appear
**Solution:**
- Ensure sample-landscape.yaml exists in backend/data/
- Check API response: http://localhost:8000/api/landscapes/sample-landscape
- Look for console errors

### Issue: Drag doesn't save positions
**Solution:**
- Check backend console for errors
- Verify YAML file is writable
- Check browser console for API errors

## 💡 Tips

1. **Grid Alignment**: When dragging, press Shift for snap-to-grid (future feature)
2. **Multi-Select**: Hold Shift and drag to select multiple nodes
3. **Delete Edges**: Click edge and press Delete key
4. **Fit View**: Use the "fit view" button to reset zoom
5. **Mini-map**: Click mini-map to jump to that area

## 🎓 Learning Resources

- **React Flow Docs**: https://reactflow.dev/
- **YAML Schema**: See [docs/yaml-schema.md](docs/yaml-schema.md)
- **API Endpoints**: http://localhost:8000/docs

## 🎯 Success Metrics

✅ Diagram displays all systems from YAML
✅ Connections show correct relationships
✅ Drag-and-drop repositioning works
✅ Positions save to YAML file
✅ Zoom and pan controls work
✅ Mini-map displays correctly
✅ Custom styling applied
✅ Auto-save on drag complete

---

**Phase 2 Status: ✅ COMPLETE**

Ready to continue with Phase 3 (YAML Editor)?
