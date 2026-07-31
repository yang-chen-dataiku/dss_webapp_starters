# Angular Webapp Starter for Dataiku

A starter template for building modern webapps that deploy to Dataiku. Uses Angular 18 for the frontend and Python (FastAPI/Flask) backend.

**Why this approach?** Dataiku webapps only accept single HTML/CSS/JS files, which becomes painful as your app grows. This starter lets you develop with modern tooling locally, then builds everything into the format Dataiku expects.

## Prerequisites

Install these tools (restart your terminal after each):

#### Standard

```bash
# 1. Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# Restart terminal, then:
nvm install node && nvm use node

# 2. pnpm (package manager)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 3. uv (Python project manager)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Homebrew

```bash
# 1. Node.js via nvm, pnpm (Node package manager), uv (Python project manager)
brew install nvm pnpm uv

# 2. Restart terminal, then:
nvm install node && nvm use node
```

## Quick Start

### 1. Setup

Copy the template environment file in the project folder to `.env` to your project:

```bash
cp .env.example .env
```

Open `.env` and change the following values:

- `DKU_API_KEY`: Create your DSS instance API key (Profile -> API Keys -> Create new key) and copy the secret key.
- `DKU_DSS_URL`: Copy the DSS instance URL from your browser.
- `DKU_CURRENT_PROJECT_KEY`: Copy the target project key in the instance.

### 2. Run Development Servers

You need **two terminals**. The second terminal to run the backend also has two options depending on if you want to run Flask or FastAPI:

#### Frontend

```bash
# Frontend (http://localhost:4200)
pnpm install
pnpm dev
```

#### Backend

```bash
# Flask backend (http://localhost:5000)
make backend-start

# FastAPI backend (http://localhost:5000)
# Make sure the BACKEND_TYPE shell variable is exported if you start a new shell session
export BACKEND_TYPE=fastapi
make backend-start
```

Open `http://localhost:4200` - you're ready to develop!

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

#### JavaScript tab

```javascript
const backendURL = dataiku.getWebAppBackendUrl(
  "fetch/bs_init?URL=" + getWebAppBackendUrl(""),
);

window.onload = function () {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", backendURL);
  ifrm.setAttribute(
    "style",
    "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;",
  );
  document.body.appendChild(ifrm);
};

$.getJSON(getWebAppBackendUrl("/first_api_call"), function (data) {
  console.log("Received data from backend", data);
  const output = $("<pre />").text("Backend reply: " + JSON.stringify(data));
  $("body").append(output);
});
```

#### Python tab

**Flask**:

```python
from flask import Flask
from webaiku.extension import WEBAIKU
from your_webapp_name.backend.fetch_api import fetch_api

WEBAIKU(app, "webapps/your_webapp_name/dist")
WEBAIKU.extend(app, [fetch_api])
```

**FastAPI**:

```python
from fastapi import FastAPI
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

> [!NOTE]
> The white page occurs due to a default browser cache header (`Cache-Control`) returned by the `webaiku` package (default: 30 days). The hard refresh clears the cache allowing the header to set a new expiry date.
>
> If you need to change this setting or unset the cache header

## Command Reference

| Task             | Command                |
| ---------------- | ---------------------- |
| Install frontend | `pnpm install`         |
| Start frontend   | `pnpm dev`             |
| Install Flask backend for Code Studio | `make backend-build-cs` |
| Start backend    | `make backend-start`   |
| Build for deploy | `pnpm build`           |

## Switching to Production Instance

By default, this connects to Design. For Production:

1. In `pyproject.toml`, change the source of the `dataiku` library from `design.analytics.ondku.net` → `prod.analytics.ondku.net`
2. In `.env`, update `DKU_DSS_URL=https://prod.analytics.ondku.net`

## Resources

- [Angular Docs](https://v17.angular.io/docs)
- [Flask Docs](https://flask.palletsprojects.com/en/stable/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Dataiku Webapp Tutorial](https://developer.dataiku.com/latest/tutorials/webapps/code-studio/deployment/index.html)
