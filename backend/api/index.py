"""Vercel serverless entrypoint for the SevaPath FastAPI backend.

Vercel's Python runtime serves every ``.py`` file under ``api/`` as a
serverless function and looks for an ``app`` variable. This shim imports the
real FastAPI application from ``backend/server.py`` so the exact same app
runs locally (uvicorn) and on Vercel without code changes.
"""

import sys
from pathlib import Path

# Make ``backend/`` importable (server.py, routes/, services/, ai/).
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server import app  # noqa: E402  (import after sys.path fix)

__all__ = ["app"]
