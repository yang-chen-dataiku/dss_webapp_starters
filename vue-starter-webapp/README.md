# Vue Webapp Starter for Dataiku

A starter template for building modern webapps that deploy to Dataiku. Uses Vue.js + Vite for the frontend and Flask for the backend.

**Why this approach?** Dataiku webapps only accept single HTML/CSS/JS files, which becomes painful as your app grows. This starter lets you develop with modern tooling locally, then builds everything into the format Dataiku expects.

## Prerequisites

Install these tools (restart your terminal after each):

```bash
# 1. Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# restart terminal, then:
nvm install node && nvm use node

# 2. pnpm (package manager)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 3. uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Quick Start

### 1. Setup

```bash
cp .env.example .env
```

Edit `.env` and add your Dataiku API key (Profile → API Keys → Create new key).

### 2. Run Development Servers

You need **two terminals**:

```bash
# Terminal 1: Frontend (http://localhost:4200)
pnpm install
pnpm dev

# Terminal 2: Backend (http://localhost:5000)
make backend-install
make backend-start
```

Open http://localhost:4200 - you're ready to develop!

## Development

### Adding UI Components

This starter includes [shadcn-vue](https://www.shadcn-vue.com/docs/components) for building UIs quickly:

```bash
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add table
pnpm dlx shadcn-vue@latest add dialog
```

Browse all components at [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components).

## Deployment to Dataiku

### 1. Build

```bash
pnpm build
git add dist/ && git commit -m "Build webapp" && git push
```

### 2. Setup Code Library

1. Go to your Dataiku project → **Code Library**
2. Sync your repo under `webapps/your_webapp_name`
3. Add `"webapps"` to `external_libraries.json`:
   ```json
   { "pythonPath": ["python", "webapps"] }
   ```

### 3. Create Webapp

Create a new **Code Webapp** in Dataiku.

**JavaScript tab:**
```javascript
const backendURL = dataiku.getWebAppBackendUrl('fetch/bs_init?URL=' + getWebAppBackendUrl(''));

window.onload = function() {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", backendURL);
    ifrm.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;");
    document.body.appendChild(ifrm);
}

$.getJSON(getWebAppBackendUrl('/first_api_call'), function(data) {
    console.log('Received data from backend', data);
    const output = $('<pre />').text('Backend reply: ' + JSON.stringify(data));
    $('body').append(output);
});
```

**Python tab:**
```python
from flask import Flask
from webaiku.extension import WEBAIKU
from your_webapp_name.backend.fetch_api import fetch_api

WEBAIKU(app, "webapps/your_webapp_name/dist")
WEBAIKU.extend(app, [fetch_api])
```

Replace `your_webapp_name` with your actual folder name.

## Redeployment

After pushing changes:
1. **Code Library:** Click "Reset from remote HEAD"
2. **Webapp:** Restart the backend

White page? Hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

## Command Reference

| Task | Command |
|------|---------|
| Install frontend | `pnpm install` |
| Start frontend | `pnpm dev` |
| Install backend | `make backend-install` |
| Start backend | `make backend-start` |
| Build for deploy | `pnpm build` |
| Add UI component | `pnpm dlx shadcn-vue@latest add <name>` |

## Switching to Production Instance

By default, this connects to Design. For Production:

1. In `requirements.local.txt`, change `design.analytics.ondku.net` → `prod.analytics.ondku.net`
2. In `.env`, update `DKU_DSS_URL=https://prod.analytics.ondku.net`

## Resources

- [shadcn-vue Components](https://www.shadcn-vue.com/docs/components)
- [Vue.js Docs](https://vuejs.org/)
- [Dataiku Webapp Tutorial](https://developer.dataiku.com/latest/tutorials/webapps/code-studio/deployment/index.html)
