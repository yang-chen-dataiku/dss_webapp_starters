# Makefile for backend (Flask) in this vueapp directory using uv
# Requires uv installed: https://docs.astral.sh/uv/

UV ?= uv
PYTHON_VERSION ?= 3.10
VENV_DIR := .venv
BACKEND_TYPES ?= flask fastapi
BACKEND_TYPE ?= flask

empty :=
space := $(empty) $(empty)
BACKEND_TYPES_DISPLAY := $(subst $(space),|,$(BACKEND_TYPES))

# Fail on an unsupported value
ifeq ($(filter $(BACKEND_TYPE),$(BACKEND_TYPES)),)
$(error BACKEND_TYPE must be one of: $(BACKEND_TYPES_DISPLAY) (got '$(BACKEND_TYPE)'))
endif

UV_FLAGS := -p $(PYTHON_VERSION) --extra $(BACKEND_TYPE)

.PHONY: help backend-build backend-build-cs backend-install backend-start backend-clean

help:
	@echo "Targets:"
	@echo "  backend-build  - Sync project dependencies with uv (py$(PYTHON_VERSION))"
	@echo "  backend-build-cs - Sync Flask dependencies for Dataiku Code Studio"
	@echo "  backend-start  - Start Python backend (loads ./.env)"
	@echo "  backend-clean  - Remove backend virtualenv"
	@echo ""
	@echo "Variables:"
	@echo "  BACKEND_TYPE	- Backend framework: {$(shell echo '$(BACKEND_TYPES)' | tr ' ' '|')} (default: $(BACKEND_TYPE))"
	@echo "  PYTHON_VERSION	- Python version passed to uv (default: $(PYTHON_VERSION))"
	@echo ""
	@echo "Example: make backend-start BACKEND_TYPE=fastapi"

# Sync project dependencies with uv
backend-build:
	$(UV) sync $(UV_FLAGS)

# Sync Flask dependencies for Dataiku Code Studio
backend-build-cs:
	uv sync -p 3.10 --extra flask \
		--allow-insecure-host design.ds-platform.ondku.net \
		--allow-insecure-host pypi.org \
		--allow-insecure-host files.pythonhosted.org

# Start backend
backend-start:
	$(UV) run $(UV_FLAGS) -m backend.$(BACKEND_TYPE).app

# Remove the backend virtual environment
backend-clean:
	rm -rf $(VENV_DIR)
