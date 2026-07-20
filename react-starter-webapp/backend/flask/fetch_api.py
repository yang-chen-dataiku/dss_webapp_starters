from flask import Blueprint, jsonify

fetch_api = Blueprint("fetch_api", __name__, url_prefix="/api")


@fetch_api.route("/projects", methods=["GET"])
def get_projects():
    """Return the list of DSS projects."""
    try:
        import dataiku
        client = dataiku.api_client()
        projects = client.list_projects()
        return jsonify(projects)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@fetch_api.route("/llms", methods=["GET"])
def get_llms():
    """Return the list of available LLMs."""
    try:
        import dataiku
        project = dataiku.api_client().get_default_project()
        llms = project.list_llms()
        return jsonify([{"id": llm.id, "type": llm.type, "description": llm.description} for llm in llms])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
