# Makefile for backend (Flask) in this reactapp directory using uv
# Requires uv installed: https://docs.astral.sh/uv/

UV ?= uv
PYTHON_VERSION ?= 3.10
VENV_DIR := .venv

REQUIREMENTS := requirements.local.txt

.PHONY: help backend-build backend-venv backend-install backend-start backend-clean

help:
	@echo "Targets:"
	@echo "  backend-build  - Create uv venv (py$(PYTHON_VERSION)) and install reqs"
	@echo "  backend-start  - Start Flask backend (loads ./.env)"
	@echo "  backend-clean  - Remove backend virtualenv"

backend-build: backend-install

backend-venv:
	$(UV) venv --python $(PYTHON_VERSION)

backend-install: backend-venv $(REQUIREMENTS)
	$(UV) pip install -r requirements.local.txt

backend-start:
	$(UV) run --env-file .env -m backend.wsgi

backend-clean:
	rm -rf $(VENV_DIR)
