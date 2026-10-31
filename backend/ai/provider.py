"""
AIProvider abstraction.

Primary: Gemini
Fallback: OpenAI

Application code never depends on a specific provider — swap or
disable providers here without touching routes.
"""
from __future__ import annotations

import os
import logging
import asyncio
import requests
from typing import Dict, Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Placeholder detection — treat known placeholder strings as missing.
# ---------------------------------------------------------------------------
_PLACEHOLDER_PATTERNS = frozenset({
    "your_gemini_api_key_here",
    "your_openai_api_key_here",
    "your-api-key-here",
    "PASTE_YOUR_KEY_HERE",
    "sk-placeholder",
    "your_actual_google_key",
    "",
})


def _resolve_key(env_var: str) -> Optional[str]:
    """Return the key value or None if missing / placeholder."""
    raw = os.environ.get(env_var, "")
    if not raw or raw.strip().lower() in {p.lower() for p in _PLACEHOLDER_PATTERNS}:
        return None
    return raw.strip()


GEMINI_API_KEY = _resolve_key("GEMINI_API_KEY")
OPENAI_API_KEY = _resolve_key("OPENAI_API_KEY")

# ---------------------------------------------------------------------------
# Model configuration — use current, valid identifiers.
# ---------------------------------------------------------------------------
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

PRIMARY_PROVIDER = ("gemini", GEMINI_MODEL)
FALLBACK_PROVIDER = ("openai", OPENAI_MODEL)


# ---------------------------------------------------------------------------
# Status / diagnostics — never expose key values.
# ---------------------------------------------------------------------------

def get_status() -> Dict[str, str]:
    """Safe configuration status (never includes key values)."""
    gemini_ok = GEMINI_API_KEY is not None
    openai_ok = OPENAI_API_KEY is not None
    if gemini_ok:
        active = "gemini"
        model = GEMINI_MODEL
    elif openai_ok:
        active = "openai"
        model = OPENAI_MODEL
    else:
        active = "none"
        model = "none"
    return {
        "gemini_configured": gemini_ok,
        "openai_configured": openai_ok,
        "active_provider": active,
        "active_model": model,
    }


def log_startup_status() -> None:
    """Log provider availability. Call after logging.basicConfig."""
    st = get_status()
    logger.info(
        "AI provider status — Gemini: %s (model=%s), OpenAI: %s (model=%s), Active: %s",
        "ready" if st["gemini_configured"] else "NOT configured",
        GEMINI_MODEL,
        "ready" if st["openai_configured"] else "NOT configured",
        OPENAI_MODEL,
        st["active_provider"],
    )
    if not st["gemini_configured"] and not st["openai_configured"]:
        logger.warning(
            "No AI provider credentials configured. "
            "SevaPath Guide will return unavailable responses. "
            "Set GEMINI_API_KEY or OPENAI_API_KEY in backend/.env and restart."
        )


def _sync_one_shot(
    system_message: str,
    user_text: str,
    provider: str,
    model: str,
) -> str:
    if provider == "gemini":
        if not GEMINI_API_KEY:
            raise ValueError("Gemini provider unavailable: API key not configured")
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={GEMINI_API_KEY}"
        )
        payload = {
            "system_instruction": {
                "parts": [{"text": system_message}]
            },
            "contents": [{
                "parts": [{"text": user_text}]
            }]
        }
        try:
            resp = requests.post(url, json=payload, timeout=30)
        except requests.ConnectionError:
            raise ConnectionError(f"Gemini network error: could not reach API (provider=gemini, model={model})")
        except requests.Timeout:
            raise TimeoutError(f"Gemini timeout: request exceeded 30s (provider=gemini, model={model})")

        if not resp.ok:
            # Log ONLY safe metadata — never the URL (it contains the key)
            body_preview = resp.text[:500] if resp.text else "(empty)"
            logger.error(
                "Gemini HTTP %s for model %s: %s",
                resp.status_code, model, body_preview,
            )
            # Raise a sanitized error — never use raise_for_status() which
            # embeds the full URL (including ?key=...) in the exception string.
            raise ValueError(
                f"Gemini HTTP {resp.status_code} (provider=gemini, model={model})"
            )

        data = resp.json()
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as e:
            logger.error("Gemini response parsing failed. Keys present: %s", list(data.keys()))
            raise ValueError(f"Unexpected response format from Gemini") from e

    elif provider == "openai":
        if not OPENAI_API_KEY:
            raise ValueError("OpenAI provider unavailable: API key not configured")
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_text}
            ]
        }
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=30)
        except requests.ConnectionError:
            raise ConnectionError(f"OpenAI network error: could not reach API (provider=openai, model={model})")
        except requests.Timeout:
            raise TimeoutError(f"OpenAI timeout: request exceeded 30s (provider=openai, model={model})")

        if not resp.ok:
            body_preview = resp.text[:500] if resp.text else "(empty)"
            logger.error(
                "OpenAI HTTP %s for model %s: %s",
                resp.status_code, model, body_preview,
            )
            raise ValueError(
                f"OpenAI HTTP {resp.status_code} (provider=openai, model={model})"
            )
        data = resp.json()
        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            logger.error("OpenAI response parsing failed. Keys present: %s", list(data.keys()))
            raise ValueError(f"Unexpected response format from OpenAI") from e

    else:
        raise ValueError(f"Unknown provider: {provider}")


async def _one_shot(
    system_message: str,
    user_text: str,
    provider: str,
    model: str,
    session_id: str,
) -> str:
    return await asyncio.to_thread(_sync_one_shot, system_message, user_text, provider, model)


async def complete(
    system_message: str,
    user_text: str,
    *,
    session_id: str,
) -> Dict[str, str]:
    """Try primary provider; on failure fall back.

    Returns {text, provider_used, model_used}.
    """
    if not GEMINI_API_KEY and not OPENAI_API_KEY:
        logger.info("Copilot request skipped — no AI credentials configured")
        return {
            "text": (
                "SevaPath Guide is not yet configured in this environment. "
                "To enable AI guidance, add a valid GEMINI_API_KEY or "
                "OPENAI_API_KEY to backend/.env and restart the server.\n\n"
                "You can still use SevaPath to browse services, check "
                "eligibility, and follow the step-by-step journey."
            ),
            "provider_used": "none",
            "model_used": "none",
            "reason": "not_configured",
        }

    errors = []
    for provider, model in (PRIMARY_PROVIDER, FALLBACK_PROVIDER):
        try:
            text = await _one_shot(
                system_message, user_text, provider, model, session_id
            )
            logger.info("Copilot served by %s/%s", provider, model)
            return {
                "text": text,
                "provider_used": provider,
                "model_used": model,
                "reason": "ok",
            }
        except Exception as e:  # noqa: BLE001
            error_type = type(e).__name__
            logger.warning(
                "AI provider %s/%s failed [%s]: %s",
                provider, model, error_type, e,
            )
            errors.append(f"{provider}/{model}: {error_type}")
            continue

    # Classify the dominant failure for the reason field
    reason = "provider_error"
    for err in errors:
        err_lower = err.lower()
        if "401" in err or "403" in err or "auth" in err_lower:
            reason = "auth_failure"
            break
        if "429" in err or "quota" in err_lower or "rate" in err_lower:
            reason = "rate_limit"
            break
        if "connectionerror" in err_lower or "timeout" in err_lower:
            reason = "network_error"

    logger.error("All AI providers exhausted (%s). Errors: %s", reason, "; ".join(errors))
    return {
        "text": (
            "The assistant is unavailable right now. Please try again "
            "in a moment — you can still browse the journey directly."
        ),
        "provider_used": "none",
        "model_used": "none",
        "reason": reason,
    }
