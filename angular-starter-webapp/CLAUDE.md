# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 18 webapp starter that deploys to Dataiku. Builds to `dist/` with deterministic asset names (no hashes) required by Dataiku webapps. Uses `webaiku` library to bridge the Angular app with Dataiku's webapp system.

Unlike the Vue/React starters which use Vite, this project uses Angular CLI (`@angular/build:application`, esbuild-based). Uses **Tailwind v3** (not v4) — Angular's build pipeline passes CSS to PostCSS as an in-memory string with no file path, which breaks Tailwind v4's scanner. Tailwind v3 uses an explicit `content` array in `tailwind.config.js` that works regardless of how PostCSS is invoked.

## Commands

### Development
```bash
# Frontend (Terminal 1)
pnpm install
pnpm dev              # ng serve at http://localhost:4200

# Backend (Terminal 2)
make backend-install
make backend-start    # Starts at http://localhost:5000
```

### Build & Deploy
```bash
pnpm build            # ng build → dist/ with outputHashing:none
pnpm type-check       # TypeScript check only
pnpm format           # Prettier formatting
```

## Architecture

### Frontend (`src/`)
- **Bootstrap** (`src/main.ts`): `bootstrapApplication(AppComponent, appConfig)`
- **App config** (`src/app/app.config.ts`): Provides router, HttpClient, and `APP_BASE_HREF` (Dataiku base path detection via `getBase()`)
- **Routes** (`src/app/app.routes.ts`): Eager-loaded routes; `/fetch/**` redirects to `/`
- **Root component** (`src/app/app.component.ts`): Tab bar + `<router-outlet>`. Syncs route to parent frame URL via `Router.events`. Uses `toSignal()` for reactive URL tracking.
- **API service** (`src/app/api/api.service.ts`): Angular `HttpClient` wrapper. Auto-detects `window.getWebAppBackendUrl` for Dataiku prod; falls back to relative URLs (works with `ng serve` proxy).
- **UI components** (`src/app/components/ui/`): Standalone Angular components using host-element class binding (`@HostBinding('class')`). No wrapper divs — components are the DOM element.
- **Views** (`src/app/views/`): Standalone components using Angular 17+ signals (`signal`, `computed`) and `toSignal()` to convert RxJS observables.
- **Utils** (`src/app/lib/utils.ts`): `cn()`, `inIframe()`, `getBase()`

### Backend (`backend/`)
- **Flask app** (`wsgi.py`): Entry point, initializes WEBAIKU extension
- **API routes** (`fetch_api.py`): Blueprint at `/api/*`

### Key Integration Points
- `ng serve` proxies `/api/*` to Flask via `proxy.conf.json`
- `APP_BASE_HREF` is set to `getBase()` at runtime — handles Dataiku's nested URL structure
- `outputHashing: "none"` in `angular.json` gives deterministic asset filenames

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `DKU_API_KEY`: Your Dataiku API key
- `DKU_DSS_URL`: Dataiku instance URL
- `VITE_API_PORT`: Backend port (5000 by default) — also used by `make backend-start`

## Deployment Notes

- Commit `dist/` folder to repo
- Sync to Dataiku Code Library under `webapps/your_webapp_name`
- Add `"webapps"` to `external_libraries.json` pythonPath
- After pushing changes: Reset Code Library from remote HEAD, restart webapp backend
