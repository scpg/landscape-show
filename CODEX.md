# Codex AI Assistant Guidelines - Landscape Show

## 1. Primary Directive
- Must follow the checklist in `AI.md` before any action (read it first).
- Always read `AI.md` first to align with project context, stack, and architecture.
- Follow cross-platform commands from `CLAUDE.md` (use `npm run` scripts and Node helpers; avoid platform-specific shells unless asked).

## 2. Operating Principles
- **API-only interactions**: Frontend changes must go through the FastAPI REST API; no direct filesystem access from UI.
- **Schema parity**: Keep backend Pydantic models, frontend TypeScript types, and docs in sync. Start changes in docs/yaml-schema.md when adjusting data shape.
- **Safety**: Preserve path-sanitization, avoid introducing external calls/telemetry, and keep edits minimal and well-scoped.
- **Async + typed**: Use async I/O on the backend; maintain strict typing on the frontend.

## 3. When Editing Code
- Mirror data model updates across: `backend/app/models/landscape.py`, `frontend/src/types/landscape.ts`, and validation/util layers (`yaml_service`, `yamlParser`, etc.).
- Use existing services/state patterns: backend services in `app/services/`; frontend global state in `frontend/src/stores/landscapeStore.ts`.
- Add tests where behavior changes (API tests for backend, Playwright/unit for frontend).

## 4. Commands to Prefer (cross-platform)
- Setup: `npm run setup`
- Dev (both): `npm run dev`
- Backend only: `npm run backend`
- Frontend only: `npm run frontend`
- Tests: `npm run test` (or targeted variants already defined)

## 5. Temporary/Debug Assets
- Place screenshots/logs in `errors-and-logs/` (already git-ignored). Avoid permanent assets there.

## 6. Security & Privacy
- Do not add outbound network calls or telemetry.
- Respect file safety: no destructive commands; keep data under `backend/data/` managed via the API layer.
