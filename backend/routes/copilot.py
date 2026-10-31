"""Copilot endpoint — intent → retrieval → clarification → guidance."""
from __future__ import annotations

import uuid
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import time

from services import registry
from ai.provider import complete
from ai.prompts import SYSTEM_PROMPT, build_user_prompt

router = APIRouter(prefix="/copilot", tags=["copilot"])


class CopilotMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=2000)


class CopilotRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    session_id: Optional[str] = Field(None, max_length=100)
    language: Optional[str] = Field("en", max_length=10)
    history: Optional[List[CopilotMessage]] = Field(None, max_length=20)


# --- Lightweight In-Memory Rate Limiter ---
# This is sufficient for v1/single-instance deployments to prevent basic scraping.
_rate_limits = {}

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Cleanup old entries every ~100 requests to prevent memory growth
    if len(_rate_limits) > 10000:
        stale = [k for k, v in _rate_limits.items() if now - v["last_request"] > 60]
        for k in stale:
            del _rate_limits[k]
            
    record = _rate_limits.setdefault(client_ip, {"tokens": 10, "last_request": now})
    
    # Refill 1 token every 2 seconds
    elapsed = now - record["last_request"]
    record["tokens"] = min(10, record["tokens"] + (elapsed * 0.5))
    record["last_request"] = now
    
    if record["tokens"] < 1:
        raise HTTPException(status_code=429, detail="Too many requests")
    
    record["tokens"] -= 1
# ------------------------------------------



@router.post("")
async def copilot(req: CopilotRequest, request: Request):
    check_rate_limit(request)
    """Single orchestrated pipeline (intent→retrieval→clarification→guidance).

    Deliberately implemented as one call — spec: 'Do NOT create
    unnecessary separate LLM calls simply to claim multi-agent AI.'
    The architecture is expandable so each stage can later become an
    independent agent if scale requires it.
    """
    session_id = req.session_id or str(uuid.uuid4())

    # 1. Retrieval (deterministic keyword + alias) — TEST_ONLY fixtures
    # are excluded from Copilot retrieval so the assistant never
    # recommends demo services in normal use.
    retrieved = registry.search(req.message, include_test=False)

    # 2. Language directive
    lang_map = {"en": "English", "hi": "Hindi", "ta": "Tamil"}
    lang_name = lang_map.get((req.language or "en").lower(), "English")

    system = (
        SYSTEM_PROMPT
        + f"\n\nRespond in {lang_name} unless the citizen explicitly asks otherwise."
    )

    user_prompt = build_user_prompt(req.message, retrieved)

    # 3. Deterministic Interception for exact matches (save Gemini quota)
    # Only match against production verified services (include_test=False above).
    # If the user exactly typed a service's canonical name, short label, or alias.
    q_lower = req.message.lower().strip()
    exact_match = None
    
    strong_keywords = {"aadhaar", "passport", "voter", "digilocker", "pan", "licence", "uan", "epf"}
    q_words = set([w.strip("?") for w in q_lower.split() if len(w) > 2])

    for r in retrieved:
        if r.get("is_test_fixture", False):
            continue
            
        canonical = r.get("canonical_name", "").lower()
        short = r.get("short_label", "").lower()
        aliases = [a.lower() for a in r.get("aliases", []) if a]
        targets = [canonical, short] + aliases
        
        match_found = False
        for target in targets:
            if target in q_lower:
                match_found = True
                break
                
            t_words = set([w for w in target.split() if len(w) > 2])
            
            # If all words of an alias are in the query
            if t_words and t_words.issubset(q_words):
                match_found = True
                break
                
            # If query is short, subset of an alias, and contains a strong keyword
            if len(q_words) > 0 and len(q_words) <= 3 and q_words.issubset(t_words):
                if q_words.intersection(strong_keywords):
                    match_found = True
                    break

        if match_found:
            exact_match = r
            break

    if exact_match:
        # Avoid the LLM entirely
        locales = {
            "en": (
                f"SevaPath found the verified service:\n"
                f"**{exact_match.get('short_label')}**\n\n"
                f"Official service:\n"
                f"{exact_match.get('canonical_name')}\n\n"
                f"{exact_match.get('description')}\n\n"
                f"You can start the SevaPath journey to check eligibility, documents, procedure, and the official application."
            ),
            "hi": (
                f"SevaPath को यह सत्यापित सेवा मिली है:\n"
                f"**{exact_match.get('short_label')}**\n\n"
                f"आधिकारिक सेवा:\n"
                f"{exact_match.get('canonical_name')}\n\n"
                f"{exact_match.get('description')}\n\n"
                f"पात्रता, दस्तावेज़, प्रक्रिया और आधिकारिक आवेदन की जांच करने के लिए आप SevaPath यात्रा शुरू कर सकते हैं।"
            ),
            "ta": (
                f"SevaPath இந்த சரிபார்க்கப்பட்ட சேவையை கண்டறிந்துள்ளது:\n"
                f"**{exact_match.get('short_label')}**\n\n"
                f"அதிகாரப்பூர்வ சேவை:\n"
                f"{exact_match.get('canonical_name')}\n\n"
                f"{exact_match.get('description')}\n\n"
                f"தகுதி, ஆவணங்கள், நடைமுறை மற்றும் அதிகாரப்பூர்வ விண்ணப்பத்தை சரிபார்க்க நீங்கள் SevaPath பயணத்தை தொடங்கலாம்."
            )
        }
        user_lang = (req.language or "en").lower()
        reply = locales.get(user_lang, locales["en"])
        
        result = {
            "text": reply,
            "provider_used": "deterministic",
            "model_used": "local_registry",
            "reason": "exact_match"
        }
    else:
        # Fallback to AI for natural language, ambiguity, and explanations
        try:
            result = await complete(system, user_prompt, session_id=session_id)
            if result.get("reason") in ["auth_failure", "rate_limit", "network_error", "provider_error"]:
                # The AI provider failed gracefully (e.g. rate limit, unavailable).
                # Check if we can provide a deterministic fallback.
                if retrieved:
                    fallback_text = (
                        "The AI guide is currently unavailable, but these verified "
                        "services match your request:\n\n"
                    )
                    for r in retrieved[:3]:
                        fallback_text += f"- **{r['short_label']}**: {r['description']}\n\n"
                    
                    result = {
                        "text": fallback_text.strip(),
                        "provider_used": "deterministic_fallback",
                        "model_used": "local_registry",
                        "reason": result.get("reason")
                    }
        except ValueError as e:
            if "HTTP" in str(e) or "provider" in str(e).lower():
                raise HTTPException(status_code=502, detail="Provider unavailable")
            raise

    # 4. Deterministic UI suggestions based on retrieval
    suggestions = []
    for r in retrieved[:3]:
        suggestions.append({
            "type": "open_service",
            "label": f"Open: {r['short_label']}",
            "service_id": r["id"],
            "is_test_fixture": r.get("is_test_fixture", False),
        })

    return {
        "session_id": session_id,
        "reply": result["text"],
        "provider_used": result["provider_used"],
        "model_used": result["model_used"],
        "reason": result.get("reason", "unknown"),
        "retrieved_services": retrieved,
        "suggested_actions": suggestions,
        "safety_notice": (
            "SevaPath is a guide, not a government authority. "
            "AI answers may be incomplete — always confirm with an "
            "official source before acting."
        ),
    }
