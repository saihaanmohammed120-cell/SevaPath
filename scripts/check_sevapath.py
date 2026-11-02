"""
SevaPath environment check.

Run from E:\\Sevapath:
    python check_sevapath.py

Checks:
  1. backend/.env exists and has required vars
  2. API key placeholders are detected as missing
  3. Real keys are detected (value is never printed)
  4. Backend is reachable at http://127.0.0.1:8001
  5. /api/status reports provider configuration
  6. /api/copilot returns a response
  7. Frontend .env.local points to the backend

Never prints or logs API key values.
"""
import os
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"

# ---------------------------------------------------------------------------
# Known placeholders (same list as provider.py)
# ---------------------------------------------------------------------------
PLACEHOLDERS = {
    "your_gemini_api_key_here",
    "your_openai_api_key_here",
    "your-api-key-here",
    "paste_your_key_here",
    "sk-placeholder",
    "your_actual_google_key",
    "",
}

ok_count = 0
warn_count = 0
fail_count = 0


def ok(msg):
    global ok_count
    ok_count += 1
    print(f"  [OK]   {msg}")


def warn(msg):
    global warn_count
    warn_count += 1
    print(f"  [WARN] {msg}")


def fail(msg):
    global fail_count
    fail_count += 1
    print(f"  [FAIL] {msg}")


def is_placeholder(value):
    return not value or value.strip().lower() in PLACEHOLDERS


# ===========================================================================
print("\n=== SevaPath Environment Check ===\n")
print(f"Project root: {ROOT}")
print()

# --- 1. backend/.env ---
print("1. Backend .env")
env_file = BACKEND / ".env"
if not env_file.exists():
    fail("backend/.env not found")
else:
    ok(f"backend/.env exists")
    env_vars = {}
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            k, v = line.split("=", 1)
            env_vars[k.strip()] = v.strip()

    for required in ["CORS_ORIGINS"]:
        if required in env_vars:
            ok(f"{required} is set")
        else:
            fail(f"{required} is missing")

    # MongoDB is currently unused by routes — optional
    mongo_val = env_vars.get("MONGO_URL", "")
    if mongo_val:
        ok("MONGO_URL is set (database available for future use)")
    else:
        warn("MONGO_URL is empty or missing — running without database (no routes currently require it)")

print()

# --- 2. API keys ---
print("2. API Key Configuration")
gemini_val = env_vars.get("GEMINI_API_KEY", "")
openai_val = env_vars.get("OPENAI_API_KEY", "")

if is_placeholder(gemini_val):
    warn("GEMINI_API_KEY is a placeholder or missing — Gemini provider will be disabled")
else:
    ok(f"GEMINI_API_KEY is set (length={len(gemini_val)} chars)")

if is_placeholder(openai_val):
    warn("OPENAI_API_KEY is a placeholder or missing — OpenAI fallback will be disabled")
else:
    ok(f"OPENAI_API_KEY is set (length={len(openai_val)} chars)")

if is_placeholder(gemini_val) and is_placeholder(openai_val):
    warn("No real API key configured — SevaPath Guide will be unavailable")
    warn("Get a Gemini key at: https://aistudio.google.com/apikey")
    warn("Then edit backend/.env and replace the placeholder value")

print()

# --- 3. Frontend .env.local ---
print("3. Frontend Configuration")
fe_env = FRONTEND / ".env.local"
if not fe_env.exists():
    fail("frontend/.env.local not found")
else:
    fe_text = fe_env.read_text()
    if "REACT_APP_BACKEND_URL" in fe_text:
        ok("REACT_APP_BACKEND_URL is set in frontend/.env.local")
    else:
        fail("REACT_APP_BACKEND_URL missing from frontend/.env.local")

print()

# --- 4. Backend connectivity ---
print("4. Backend Connectivity")
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    warn("'requests' not installed — skipping live backend checks")

if HAS_REQUESTS:
    base = "http://127.0.0.1:8001"
    try:
        r = requests.get(f"{base}/api/", timeout=5)
        if r.status_code == 200:
            j = r.json()
            ok(f"Backend reachable — {j.get('product', '?')} status={j.get('status', '?')}")
        else:
            fail(f"Backend returned HTTP {r.status_code}")
    except requests.ConnectionError:
        warn("Backend not reachable at http://127.0.0.1:8001 — is it running?")
        warn("Start it with: cd backend && uvicorn server:app --host 127.0.0.1 --port 8001 --reload")
    except Exception as e:
        fail(f"Backend check error: {e}")

    print()

    # --- 5. /api/status ---
    print("5. Provider Status (from running backend)")
    try:
        r = requests.get(f"{base}/api/status", timeout=5)
        if r.status_code == 200:
            st = r.json()
            gemini_status = "ready" if st.get("gemini_configured") else "NOT configured"
            openai_status = "ready" if st.get("openai_configured") else "NOT configured"
            ok(f"Gemini:  {gemini_status}")
            ok(f"OpenAI:  {openai_status}")
            ok(f"Active:  {st.get('active_provider', '?')}")
            ok(f"Model:   {st.get('active_model', '?')}")
        elif r.status_code == 404:
            warn("/api/status not found — backend may need restart after update")
        else:
            fail(f"/api/status returned HTTP {r.status_code}")
    except requests.ConnectionError:
        warn("Backend not reachable — skipping status check")
    except Exception as e:
        fail(f"Status check error: {e}")

    print()

    # --- 6. /api/copilot ---
    print("6. Copilot Endpoint")
    try:
        r = requests.post(
            f"{base}/api/copilot",
            json={"message": "hello", "language": "en"},
            timeout=35,
        )
        if r.status_code == 200:
            j = r.json()
            provider = j.get("provider_used", "?")
            model = j.get("model_used", "?")
            reason = j.get("reason", "?")
            reply_len = len(j.get("reply", ""))
            ok(f"Copilot responded — provider={provider}, model={model}, reason={reason}, reply_length={reply_len}")
            if provider == "none":
                warn("Copilot returned no AI response (see reason above)")
            if reason == "ok":
                ok("SevaPath Guide is OPERATIONAL with live AI")
        else:
            fail(f"Copilot returned HTTP {r.status_code}")
    except requests.ConnectionError:
        warn("Backend not reachable — skipping copilot check")
    except Exception as e:
        fail(f"Copilot check error: {e}")

print()

# --- Summary ---
print("=" * 44)
total = ok_count + warn_count + fail_count
print(f"  {ok_count} passed, {warn_count} warnings, {fail_count} failures")
if fail_count > 0:
    print("  Status: NEEDS ATTENTION")
elif warn_count > 0:
    print("  Status: WORKING (with warnings)")
else:
    print("  Status: ALL GOOD")
print("=" * 44)
print()

sys.exit(1 if fail_count > 0 else 0)
