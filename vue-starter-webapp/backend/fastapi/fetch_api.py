from fastapi.responses import JSONResponse
from pydantic import BaseModel

from fastapi import APIRouter, status

fetch_api = APIRouter(prefix="/api", tags=["fetch_api"])


class LLMData(BaseModel):
    id: str
    type: str
    description: str


@fetch_api.get("/projects")
def get_projects():
    """Return the list of DSS projects."""
    try:
        import dataiku

        client = dataiku.api_client()
        projects = client.list_projects()
        return JSONResponse(status_code=status.HTTP_200_OK, content=projects)
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": str(e)}
        )


@fetch_api.get("/llms")
def get_llms() -> list[LLMData]:
    """Return the list of available LLMs."""
    try:
        import dataiku

        project = dataiku.api_client().get_default_project()
        llms = project.list_llms()
        return [
            LLMData(id=llm.id, type=llm.type, description=llm.description)
            for llm in llms
        ]
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"error": str(e)}
        )
