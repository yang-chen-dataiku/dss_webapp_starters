import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI

from .fetch_api import fetch_api

load_dotenv()

from webaiku.extension import WEBAIKU

app = FastAPI()
WEBAIKU(app, "webapps/vueapp", int(os.getenv("VITE_API_PORT")))
WEBAIKU.extend(app, [fetch_api])

if __name__ == "__main__":
    uvicorn.run(
        "backend.fastapi.app:app",
        host="127.0.0.1",
        port=int(os.getenv("VITE_API_PORT")),
    )
