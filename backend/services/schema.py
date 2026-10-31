"""
Service catalogue schema.

This mirrors the Zod schema described in the SevaPath spec but expressed
with Pydantic v2 so we can validate every record loaded into the
production registry.  Records that fail validation MUST NOT enter the
production registry — see registry.load_services().
"""
from __future__ import annotations

from enum import Enum
from typing import List, Optional, Literal, Any
from pydantic import BaseModel, Field, ConfigDict, HttpUrl, field_validator, ValidationInfo, TypeAdapter
import re

def validate_safe_url(url: Any) -> Any:
    """Ensure URL is HTTP/HTTPS and rejects dangerous schemes/destinations."""
    if not url:
        return url
        
    s_url = str(url).strip()
    if not s_url:
        return url
        
    # Strictly reject non-HTTP(S)
    lower_url = s_url.lower()
    if lower_url.startswith("javascript:") or lower_url.startswith("data:") or lower_url.startswith("file:"):
        raise ValueError("Unsafe URL scheme detected")
        
    # Strictly parse to ensure structural validity
    TypeAdapter(HttpUrl).validate_python(s_url)
        
    if not lower_url.startswith("http://") and not lower_url.startswith("https://"):
        raise ValueError("Only HTTP/HTTPS URLs are permitted")
        
    # Enforce HTTPS for official sources in production
    # (Allow http for localhost testing, but strictly block non-https for public domains)
    is_localhost = re.search(r'^https?://(localhost|127\.0\.0\.1)(:\d+)?/', lower_url)
    if lower_url.startswith("http://") and not is_localhost:
        raise ValueError("Official sources must use HTTPS")
        
    return s_url


class VerificationState(str, Enum):
    draft = "draft"
    reviewed = "reviewed"
    verified = "verified"
    needs_review = "needs-review"
    unverified = "unverified"


class SourceOrigin(str, Enum):
    official = "official"
    ai_guidance = "ai-guidance"
    test_only = "TEST_ONLY"
    user_input = "user-input"


class ApplicationMode(str, Enum):
    online = "online"
    offline = "offline"
    hybrid = "hybrid"
    unavailable = "unavailable"


class Jurisdiction(BaseModel):
    country: str = "IN"
    level: Literal["central", "state", "ut", "district", "local"]
    state: Optional[str] = None
    district: Optional[str] = None


class Authority(BaseModel):
    name: str
    department: Optional[str] = None
    website: Optional[str] = None

    @field_validator("website")
    @classmethod
    def _validate_website(cls, v: Any) -> Any:
        return validate_safe_url(v)


class EligibilityRule(BaseModel):
    id: str
    question: str
    kind: Literal["boolean", "number", "choice"]
    # Required for choice
    options: Optional[List[str]] = None
    # Deterministic predicate expressed declaratively
    predicate: dict
    explanation: str


class DocumentSpec(BaseModel):
    id: str
    name: str
    required: bool
    description: str
    alternatives: List[str] = Field(default_factory=list)


class ProcedureStep(BaseModel):
    step: int
    title: str
    description: str


class OfficialSource(BaseModel):
    label: str
    url: Optional[str] = None
    accessed: Optional[str] = None

    @field_validator("url")
    @classmethod
    def _validate_url(cls, v: Any) -> Any:
        return validate_safe_url(v)


class Application(BaseModel):
    mode: ApplicationMode
    official_url: Optional[str] = None
    offline_instructions: Optional[str] = None

    @field_validator("official_url")
    @classmethod
    def _validate_official_url(cls, v: Any) -> Any:
        return validate_safe_url(v)


class FAQ(BaseModel):
    id: str
    question: str
    answer: str
    category: Literal["general", "eligibility", "documents", "procedure", "application", "troubleshooting"]
    source_name: Optional[str] = None
    source_url: Optional[str] = None
    verification_status: Literal["verified", "needs_verification"]
    verified_at: Optional[str] = None
    priority: int = 5

    @field_validator("source_url")
    @classmethod
    def _validate_source_url(cls, v: Any) -> Any:
        return validate_safe_url(v)


class Localization(BaseModel):
    languages: List[str] = Field(default_factory=lambda: ["en"])


class ServiceRecord(BaseModel):
    """Full service record.  A record only enters the production registry
    if verification.state is 'verified' AND isTestFixture is False."""

    model_config = ConfigDict(extra="forbid")

    id: str
    slug: str
    version: int = 1
    jurisdiction: Jurisdiction
    authority: Authority
    identity: dict = Field(
        default_factory=dict,
        description="Canonical name + short label used in UI",
    )
    aliases: List[str] = Field(default_factory=list)
    category: str
    life_situations: List[str] = Field(default_factory=list)
    description: str
    eligibility_rules: List[EligibilityRule] = Field(default_factory=list)
    required_documents: List[DocumentSpec] = Field(default_factory=list)
    alternatives: List[str] = Field(default_factory=list)
    fees: Optional[str] = None
    deadlines: Optional[str] = None
    procedure: List[ProcedureStep] = Field(default_factory=list)
    application: Application
    official_sources: List[OfficialSource] = Field(default_factory=list)
    faqs: List[FAQ] = Field(default_factory=list)
    verification: dict = Field(default_factory=dict)
    last_verified_at: Optional[str] = None
    verified_by: Optional[str] = None
    review_notes: Optional[str] = None
    localization: Localization = Field(default_factory=Localization)
    translations: dict = Field(default_factory=dict)

    # Test fixture marker — never eligible for the production catalogue
    is_test_fixture: bool = False
    test_fixture_label: Optional[str] = None

    @field_validator("verification")
    @classmethod
    def _verification_state_required(cls, v: dict) -> dict:
        if "state" not in v:
            raise ValueError("verification.state is required")
        VerificationState(v["state"])  # will raise if invalid
        return v
