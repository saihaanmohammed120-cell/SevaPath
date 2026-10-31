"""SevaPath — FastAPI backend."""
from __future__ import annotations

import os
import logging
from pathlib import Path
from datetime import datetime, timezone

from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Configure logging BEFORE importing modules that log at import time.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# MongoDB — currently unused by routes but kept available for future expansion.
# If MONGO_URL is empty or missing, the server starts without a database connection.
mongo_url = os.environ.get("MONGO_URL", "")
if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get("DB_NAME", "sevapath")]
    logger.info("MongoDB connected: %s", os.environ.get("DB_NAME", "sevapath"))
else:
    client = None
    db = None
    logger.info("MongoDB not configured — running without database (no routes currently require it)")

app = FastAPI(title="SevaPath API")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. The issue has been logged."},
    )

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # CSP: Needs to allow API calls, React inline styles (for Framer Motion), and standard frontend assets.
        # This CSP is deliberately lightweight to avoid breaking existing functionality.
        response.headers["Content-Security-Policy"] = "default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=*"
        # Only set HSTS if we are clearly on HTTPS
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)


api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {
        "product": "SevaPath",
        "tagline": "Tell SevaPath what you're trying to get done.",
        "status": "ok",
        "time": datetime.now(timezone.utc).isoformat(),
    }


@api_router.get("/health")
async def health():
    return {"ok": True}


from routes.services import router as services_router  # noqa: E402
from routes.copilot import router as copilot_router  # noqa: E402
from ai.provider import get_status, log_startup_status  # noqa: E402

api_router.include_router(services_router)
api_router.include_router(copilot_router)


@api_router.get("/status")
async def status():
    """Safe provider config check — never exposes key values."""
    return get_status()


app.include_router(api_router)

cors_env = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allow_origins = [o.strip() for o in cors_env.split(",") if o.strip()]
allow_credentials = "*" not in allow_origins

app.add_middleware(
    CORSMiddleware,
    allow_credentials=allow_credentials,
    allow_origins=allow_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Log AI provider status now that logging and imports are configured.
log_startup_status()


@app.on_event("shutdown")
async def _shutdown():
    if client:
        client.close()
