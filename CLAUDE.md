# Claude AI Coding Assistant Guidelines - Landscape Show

## 1. Primary Directive

**Critical:** Before beginning any task, you **must** first review the `AI.md` file in the root directory.

That file contains the primary project overview, technology stack, architecture, status, and other general guidelines. This file, `CLAUDE.md`, only contains specific instructions and reminders for you.

---

## 2. Code Style Guidelines

### Backend (Python)
- Follow PEP 8.
- Use type hints for all functions.
- Use Pydantic models for all data validation.
- Use async/await for all I/O operations.
- Handle errors with specific, custom exceptions.

### Frontend (TypeScript)
- Adhere to strict TypeScript mode.
- Use functional components with hooks.
- Use the project's Zustand store for all state management.
- Provide proper typing for all props and state.

## 3. Important Notes for AI Assistants

### Special Directories 
1.  **`errors-and-logs`**: This directory is for temporary development files only (e.g., screenshots, logs). Its contents are git-ignored. Do not place permanent assets here.

### When Modifying Backend
1.  **Validate First**: Always validate data with Pydantic models before writing to a YAML file.
2.  **Use Async**: All file operations must be `async`.
3.  **Sanitize Paths**: Respect the path sanitization in `file_service.py` to prevent directory traversal.
4.  **PYTHONPATH is Required**: Remember that `PYTHONPATH` must be set correctly for the backend to run.
5.  **Update Timestamps**: Ensure the `last_updated` timestamp is modified when a landscape is changed.

### When Modifying Frontend
1.  **Sync Types**: Always mirror backend Pydantic model changes in the frontend TypeScript types (`frontend/src/types/landscape.ts`).
2.  **Use the Store**: All global state must go through the Zustand store.
3.  **Path Aliases**: Use `@/` imports for cleaner relative paths, as configured in `tsconfig.json`.
4.  **Debounce Updates**: Edits from the YAML editor that trigger re-parsing should be debounced to prevent performance issues.

### Architectural Principles
- **API-Oriented Design**: All frontend interactions with the backend **must** go through the REST API. Adhere to the full principle as described in `AI.md`.

### Data Integrity
- **System IDs**: Must be unique, lowercase, and use hyphens/underscores only.
- **Connections**: Must reference existing system IDs.
- **Colors**: Must be valid hex codes.

---

## 4. Troubleshooting Common Issues

### Backend: "ModuleNotFoundError: No module named 'app'"
- **Cause**: The `PYTHONPATH` is not set correctly.
- **Solution**: Ensure your command includes the correct, absolute path: `PYTHONPATH=/path/to/project/backend python -m app.main`.

### Frontend: "Cannot find module '@/...'"
- **Cause**: The TypeScript server or Vite config is out of sync.
- **Solution**: Restart the IDE's TypeScript server or the Vite development server.

### React Flow: Nodes not appearing
- **Cause**: The data conversion from YAML to React Flow nodes/edges has failed.
- **Solution**: Check the browser console for errors. Verify the landscape data is loaded correctly in the Zustand store and that the `yamlToFlow` utility is functioning as expected.

### CORS errors
- **Cause**: The backend is not configured to accept requests from the frontend's origin.
- **Solution**: Check the `cors_origins` setting in `app/config.py`.

---

## 5. Guiding Principles

*   **Privacy & Security**: This application is designed to be fully self-hosted. Do not introduce any external API calls, telemetry, or tracking. Maintain existing security practices like path sanitization.
*   **Performance**: Be mindful of performance. Use `async` I/O, memoize React components where appropriate, and debounce expensive operations like YAML parsing.