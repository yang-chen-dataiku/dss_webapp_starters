# Pending Learnings

Insights from past sessions. Copy relevant entries to the dataiku-cli repo's `.learnings/PENDING.md` to process them into fixes via `/cli-improvement`.

---

## 2026-06-04 Code Studios Angular dev-server base path
**Status:** pending

## Meta Analysis: Dataiku Code Studios webapp dev-server routing

### TL;DR
No `dku` CLI commands were needed; this was local repo inspection of Vue and Angular starter configs. The main insight is a documentation gap: the Dataiku webapp local-dev notes show Vite-style frontend setup but do not explicitly document how Angular CLI should consume `DKU_CODE_STUDIO_BROWSER_PATH_<port>` for Code Studios proxy paths.

### CLI Friction (0 issues)
| Issue | What Happened | Suggested Fix |
|-------|--------------|---------------|

### Skill & Doc Gaps (1 issue)
| Gap | Impact | Where to Fix |
|-----|--------|-------------|
| Missing Angular CLI Code Studios path example | Agents can correctly identify that Vite uses `DKU_CODE_STUDIO_BROWSER_PATH_<port>` but must infer the Angular equivalent for `--serve-path`, `--base-href`, or a wrapper script. | `dataiku/references/webapp-local-dev-deploy.md` or `dataiku/references/webapp-frontends.md` |

### Gotchas Hit (1 issue)
- **Tried**: Compared Vue `vite.config.ts` and Angular `angular.json` to explain why Vue redirects correctly inside Code Studios.
- **Failed**: Nothing failed, but the answer required knowing Code Studios exposes per-port browser paths through env vars and that Angular CLI does not read them automatically.
- **Fix**: Document an Angular starter pattern that reads `DKU_CODE_STUDIO_BROWSER_PATH_4200` or a configured client port and passes it to `ng serve`.
- **Document in**: Webapp local dev gotchas table / frontend framework examples.

### dataikuapi Discoveries
| Quirk | Details | Add to CLAUDE.md? |
|-------|---------|-------------------|

### Built-In Feature Misses
| What I Did | What DSS Has | Priority |
|-----------|-------------|----------|

### Recommended Changes (ranked by agent impact)
1. Add an Angular CLI Code Studios example showing `DKU_CODE_STUDIO_BROWSER_PATH_<port>` mapped to Angular dev-server/base-href options.
2. Add a short framework matrix: Vite `base`, Angular CLI `servePath`/`baseHref`, React/Vite `base`.

---
