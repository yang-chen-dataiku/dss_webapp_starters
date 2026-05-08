# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue.js + Vite webapp starter that deploys to Dataiku. Builds to single HTML/CSS/JS bundle format required by Dataiku webapps. Uses `webaiku` library to bridge Vue app with Dataiku's webapp system.

## Commands

### Development
```bash
# Frontend (Terminal 1)
pnpm install
pnpm dev              # Starts at http://localhost:4200

# Backend (Terminal 2)
make backend-install
make backend-start    # Starts at http://localhost:5000
```

### Build & Deploy
```bash
pnpm build            # Creates dist/ with single-chunk bundle
pnpm type-check       # Run TypeScript type checking
pnpm lint             # ESLint with auto-fix
pnpm format           # Prettier formatting
```

### Add UI Components
```bash
pnpm dlx shadcn-vue@latest add <component-name>
```

## Architecture

### Frontend (`src/`)
- **Router** (`src/router/index.ts`): Handles Dataiku iframe URL base path detection and parent frame URL sync for shareable links
- **API Layer** (`src/api/index.ts`, `src/Api.ts`): Axios with auto-detection of backend URL (local dev vs Dataiku production)
- **Components** (`src/components/ui/`): shadcn-vue components (add via CLI, don't create manually)
- **Views** (`src/views/`): Page components for routes
- **Utils** (`src/lib/utils.ts`): `cn()` for Tailwind class merging, `inIframe()` for Dataiku detection

### Backend (`backend/`)
- **Flask app** (`wsgi.py`): Entry point, initializes WEBAIKU extension
- **API routes** (`fetch_api.py`): Blueprint at `/api/*`, has access to `dataiku` Python library

### Key Integration Points
- Vite proxies `/api/*` to Flask backend in development
- Build outputs to `dist/` with no hashes (deterministic names for Dataiku)
- Router extracts base path from Dataiku URL patterns (`/web-apps-backends/PROJECT/ID/...`)

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `DKU_API_KEY`: Your Dataiku API key
- `DKU_DSS_URL`: Dataiku instance URL
- `VITE_CLIENT_PORT`/`VITE_API_PORT`: Dev server ports (4200/5000 by default)

## Deployment Notes

- Commit `dist/` folder to repo
- Sync to Dataiku Code Library under `webapps/your_webapp_name`
- Add `"webapps"` to `external_libraries.json` pythonPath
- After pushing changes: Reset Code Library from remote HEAD, restart webapp backend
