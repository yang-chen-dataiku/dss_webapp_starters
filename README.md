# Dataiku webapp starters

This repository collects three independent starter webapps for building modern, maintainable frontends that run as Dataiku DSS Code Webapps.

| Starter | Frontend framework |
| --- | --- |
| [Angular](angular-starter-webapp/) | Angular |
| [React](react-starter-webapp/) | React |
| [Vue](vue-starter-webapp/) | Vue |

Choose the starter that matches your team's frontend framework, then treat that folder as its own project. Each starter includes its own [README.md](angular-starter-webapp/README.md) for setup, development, and deployment, plus an [AGENTS.md](angular-starter-webapp/AGENTS.md) with implementation conventions and framework-specific guidance. Read the equivalent files in the starter you select; they are the source of truth for its details.

## What the starters have in common

All three projects follow the same overall shape:

- A framework-native frontend is developed locally, then built into static assets that Dataiku can serve from a Code Webapp.
- A Python backend sits alongside the frontend and exposes the webapp's API surface. The starters support Flask or FastAPI, so teams can use the backend style that fits their application.
- The frontend and backend are connected through a Dataiku-aware bridge, allowing the same app to work during local development and when embedded in DSS.
- The generated frontend assets are intended to be versioned with the source and synced into a Dataiku project through its Code Library; the DSS webapp then serves that build output.
- Routing and API access account for Dataiku's iframe and nested webapp URLs, so applications can retain normal single-page-app behavior inside DSS.

The starter folders deliberately share this deployment model while leaving the framework tooling, component patterns, and implementation choices native to Angular, React, or Vue.
