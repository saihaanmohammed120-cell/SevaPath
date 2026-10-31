"""
Service registry — TEST_ONLY fixtures.

Per spec: production catalogue may remain empty until verified content
is supplied.  These records are OBVIOUSLY SYNTHETIC and are labeled
TEST_ONLY.  They MUST NEVER appear in production discovery — the
loader filters them out.
"""
from __future__ import annotations

from typing import List, Dict, Optional
from .schema import ServiceRecord
from .verified import VERIFIED_SERVICES


TEST_ONLY_SERVICES: List[dict] = [
    {
        "id": "TEST_ONLY-learners-licence-demo",
        "slug": "learners-licence-demo",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "state", "state": "DEMOSTATE"},
        "authority": {
            "name": "Demo Transport Authority (TEST_ONLY)",
            "department": "Fictional Road Safety Wing",
            "website": None,
        },
        "identity": {
            "canonical_name": "Learner's Licence (TEST_ONLY demo)",
            "short_label": "Learner's Licence",
        },
        "aliases": [
            "learner licence", "learners license", "LL", "driving learner",
            "learner permit", "driving licence stage 1",
        ],
        "category": "Transport",
        "life_situations": ["turning-18", "starting-work"],
        "description": (
            "A fictional example of a learner's licence flow used to "
            "demonstrate SevaPath's journey.  This is TEST_ONLY data — "
            "it is not a real government service and must not be used "
            "for any real-world decision."
        ),
        "eligibility_rules": [
            {
                "id": "age-16",
                "question": "Are you at least 16 years old?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Applicants must be at least 16 to apply for a learner's licence (fictional rule).",
            },
            {
                "id": "resident",
                "question": "Do you currently reside in India?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "The applicant must be a resident of India (fictional rule).",
            },
        ],
        "required_documents": [
            {
                "id": "identity-proof",
                "name": "Identity proof",
                "required": True,
                "description": "Any government-issued identity document (e.g. Aadhaar, passport).",
                "alternatives": ["Aadhaar card", "Passport", "Voter ID"],
            },
            {
                "id": "address-proof",
                "name": "Address proof",
                "required": True,
                "description": "A document showing your current address.",
                "alternatives": ["Utility bill", "Rent agreement", "Bank statement"],
            },
            {
                "id": "photograph",
                "name": "Passport-size photograph",
                "required": True,
                "description": "One recent passport-size photograph.",
                "alternatives": [],
            },
            {
                "id": "medical-declaration",
                "name": "Medical self-declaration",
                "required": False,
                "description": "Self-declaration of medical fitness.",
                "alternatives": [],
            },
        ],
        "alternatives": [],
        "fees": "Illustrative fee: ₹200 (TEST_ONLY)",
        "deadlines": None,
        "procedure": [
            {"step": 1, "title": "Fill out the application form",
             "description": "Provide personal details on the fictional demo form."},
            {"step": 2, "title": "Upload or bring your documents",
             "description": "Attach identity proof, address proof and a photograph."},
            {"step": 3, "title": "Pay the application fee",
             "description": "Illustrative payment step (no real transaction)."},
            {"step": 4, "title": "Book a slot for the learner's test",
             "description": "Choose a date to appear for the learner's knowledge test."},
            {"step": 5, "title": "Appear for the test",
             "description": "Take the fictional demo test and receive a result."},
        ],
        "application": {
            "mode": "unavailable",
            "official_url": None,
            "offline_instructions": (
                "No official application route is available for this "
                "TEST_ONLY fixture.  In a real service, this would link "
                "to the state transport authority's official portal."
            ),
        },
        "official_sources": [],
        "verification": {"state": "unverified"},
        "last_verified_at": None,
        "verified_by": None,
        "review_notes": "TEST_ONLY fixture. Not a real government service.",
        "localization": {"languages": ["en", "hi", "ta"]},
        "translations": {
            "hi": {
                "identity": {
                    "short_label": "लर्निंग लाइसेंस",
                    "canonical_name": "लर्निंग लाइसेंस (TEST_ONLY demo)"
                },
                "description": "लर्निंग लाइसेंस प्रवाह का एक काल्पनिक उदाहरण।",
                "eligibility_rules": [
                    {
                        "id": "age-16",
                        "question": "क्या आपकी आयु कम से कम 16 वर्ष है?",
                        "explanation": "आवेदकों की आयु कम से कम 16 वर्ष होनी चाहिए।"
                    }
                ],
                "required_documents": [
                    {
                        "id": "identity-proof",
                        "name": "पहचान प्रमाण",
                        "description": "कोई भी सरकारी पहचान दस्तावेज़।"
                    }
                ]
            }
        },
        "is_test_fixture": True,
        "test_fixture_label": "TEST_ONLY",
    },
    {
        "id": "TEST_ONLY-scholarship-demo",
        "slug": "scholarship-demo",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Demo Ministry of Education (TEST_ONLY)",
            "department": "Fictional Scholarships Division",
            "website": None,
        },
        "identity": {
            "canonical_name": "Post-Matric Scholarship (TEST_ONLY demo)",
            "short_label": "Scholarship",
        },
        "aliases": ["scholarship", "post-matric scholarship", "education support",
                    "college scholarship", "student financial aid"],
        "category": "Education",
        "life_situations": ["starting-college", "looking-for-benefits"],
        "description": (
            "A fictional post-matric scholarship demo.  TEST_ONLY — not "
            "a real scheme."
        ),
        "eligibility_rules": [
            {
                "id": "student-status",
                "question": "Are you currently enrolled in a recognised post-matric course?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Applicants must be enrolled in a recognised course (fictional rule).",
            },
            {
                "id": "family-income",
                "question": "Is your family's annual income under ₹2,50,000?",
                "kind": "boolean",
                "predicate": {"op": "eq", "value": True},
                "explanation": "Illustrative income ceiling of ₹2,50,000 (fictional rule).",
            },
        ],
        "required_documents": [
            {"id": "identity-proof", "name": "Identity proof", "required": True,
             "description": "Any government-issued identity document.",
             "alternatives": ["Aadhaar card", "Passport"]},
            {"id": "income-certificate", "name": "Income certificate", "required": True,
             "description": "Certificate showing family income.", "alternatives": []},
            {"id": "enrolment-proof", "name": "Enrolment proof", "required": True,
             "description": "Letter or bonafide certificate from your institution.",
             "alternatives": []},
            {"id": "bank-account", "name": "Bank account details", "required": True,
             "description": "Cancelled cheque or passbook front page.", "alternatives": []},
        ],
        "alternatives": [],
        "fees": "No application fee (TEST_ONLY)",
        "deadlines": "Illustrative annual deadline: 31 October (TEST_ONLY)",
        "procedure": [
            {"step": 1, "title": "Create a demo account",
             "description": "Register on the fictional portal."},
            {"step": 2, "title": "Fill in personal & academic details",
             "description": "Provide your name, course, and institution."},
            {"step": 3, "title": "Upload documents",
             "description": "Upload identity, income and enrolment proofs."},
            {"step": 4, "title": "Submit for review",
             "description": "Institution and district officers review the application."},
            {"step": 5, "title": "Await sanction",
             "description": "Approved amount is illustratively credited to the bank account."},
        ],
        "application": {
            "mode": "unavailable",
            "official_url": None,
            "offline_instructions": (
                "No official application route is available for this "
                "TEST_ONLY fixture."
            ),
        },
        "official_sources": [],
        "verification": {"state": "unverified"},
        "last_verified_at": None,
        "verified_by": None,
        "review_notes": "TEST_ONLY fixture. Not a real government scheme.",
        "localization": {"languages": ["en", "hi", "ta"]},
        "is_test_fixture": True,
        "test_fixture_label": "TEST_ONLY",
    },
    {
        "id": "TEST_ONLY-address-update-demo",
        "slug": "address-update-demo",
        "version": 1,
        "jurisdiction": {"country": "IN", "level": "central"},
        "authority": {
            "name": "Demo Identity Authority (TEST_ONLY)",
            "department": "Fictional Records Wing",
            "website": None,
        },
        "identity": {
            "canonical_name": "Update Address on Identity Records (TEST_ONLY demo)",
            "short_label": "Update Address",
        },
        "aliases": ["change address", "move house", "update aadhaar address",
                    "change of address", "moved to new city"],
        "category": "Identity & Records",
        "life_situations": ["moving-house", "lost-documents"],
        "description": (
            "Fictional demo showing how a citizen might update their "
            "address on identity records.  TEST_ONLY."
        ),
        "eligibility_rules": [
            {"id": "resident", "question": "Are you currently residing at the new address?",
             "kind": "boolean", "predicate": {"op": "eq", "value": True},
             "explanation": "You must currently live at the address you want to update to (fictional rule)."},
        ],
        "required_documents": [
            {"id": "identity-proof", "name": "Existing identity document", "required": True,
             "description": "Your current identity document that needs updating.",
             "alternatives": []},
            {"id": "address-proof-new", "name": "New address proof", "required": True,
             "description": "A document showing your new address.",
             "alternatives": ["Utility bill (new)", "Rent agreement (new)"]},
        ],
        "alternatives": [],
        "fees": "Illustrative fee: ₹50 (TEST_ONLY)",
        "deadlines": None,
        "procedure": [
            {"step": 1, "title": "Log in with your identity number",
             "description": "Access the fictional self-service portal."},
            {"step": 2, "title": "Enter new address & upload proof",
             "description": "Provide your new address and attach a supporting document."},
            {"step": 3, "title": "Verify via OTP",
             "description": "A one-time code is sent to your registered mobile."},
            {"step": 4, "title": "Await confirmation",
             "description": "Updated records are issued within illustrative 5–10 days."},
        ],
        "application": {
            "mode": "unavailable",
            "official_url": None,
            "offline_instructions": (
                "No official application route is available for this "
                "TEST_ONLY fixture."
            ),
        },
        "official_sources": [],
        "verification": {"state": "unverified"},
        "last_verified_at": None,
        "verified_by": None,
        "review_notes": "TEST_ONLY fixture. Not a real government service.",
        "localization": {"languages": ["en", "hi", "ta"]},
        "is_test_fixture": True,
        "test_fixture_label": "TEST_ONLY",
    },
]


def _validate_all() -> List[ServiceRecord]:
    validated: List[ServiceRecord] = []
    for raw in list(VERIFIED_SERVICES) + list(TEST_ONLY_SERVICES):
        validated.append(ServiceRecord.model_validate(raw))
    return validated


_ALL_RECORDS: List[ServiceRecord] = _validate_all()

# `reviewed` and `verified` records enter production discovery.
_PRODUCTION_STATES = {"verified", "reviewed"}


def get_production_registry() -> List[ServiceRecord]:
    """Return non-test records fit for production discovery.

    A record enters production discovery if its verification.state is
    one of _PRODUCTION_STATES (`verified` or `reviewed`).  TEST_ONLY
    fixtures are never included.
    """
    return [
        r for r in _ALL_RECORDS
        if not r.is_test_fixture
        and r.verification.get("state") in _PRODUCTION_STATES
    ]


def get_test_fixtures() -> List[ServiceRecord]:
    """Return TEST_ONLY fixtures used for technical demos and testing."""
    return [r for r in _ALL_RECORDS if r.is_test_fixture]


def get_all_discoverable(*, include_test: bool = False) -> List[ServiceRecord]:
    """What powers UI discovery.

    By default this returns ONLY the production (verified/reviewed)
    registry.  TEST_ONLY fixtures are excluded unless ``include_test``
    is explicitly True — this keeps TEST_ONLY out of normal public
    discovery, per the SevaPath spec.
    """
    corpus = get_production_registry()
    if include_test:
        corpus = list(corpus) + list(get_test_fixtures())
    return corpus


def get_by_id(service_id: str) -> Optional[ServiceRecord]:
    # Include TEST_ONLY here because direct-id resolution is needed for
    # journey resume even when default discovery hides fixtures.
    for rec in list(get_production_registry()) + list(get_test_fixtures()):
        if rec.id == service_id or rec.slug == service_id:
            return rec
    return None


def search(
    query: str,
    *,
    life_situation: Optional[str] = None,
    include_test: bool = False,
) -> List[Dict]:
    """Simple keyword + alias + life-situation retrieval.

    Deliberately no vector DB — the spec says only add embeddings when
    evaluation proves the catalogue requires them.

    ``include_test`` is False by default so TEST_ONLY fixtures never
    surface in normal public discovery.  Callers that need the demo
    fixtures (dev tools, TEST_ONLY discovery chip) must opt in.
    """
    q = (query or "").strip().lower()
    corpus = list(get_production_registry())
    if include_test:
        corpus += list(get_test_fixtures())

    scored: List[tuple[float, ServiceRecord]] = []
    for rec in corpus:
        score = 0.0
        haystacks = [
            rec.identity.get("canonical_name", ""),
            rec.identity.get("short_label", ""),
            rec.category,
            rec.description,
            *rec.aliases,
            *rec.life_situations,
        ]
        hay = " ".join(h.lower() for h in haystacks if h)
        if q and q in hay:
            score += 3
        for token in [tok for tok in q.split() if len(tok) > 2]:
            if token in hay:
                score += 1
        if life_situation and life_situation in rec.life_situations:
            score += 5
        if score > 0:
            scored.append((score, rec))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [_summary(rec) for _, rec in scored[:10]]


def _summary(rec: ServiceRecord) -> dict:
    return {
        "id": rec.id,
        "slug": rec.slug,
        "canonical_name": rec.identity.get("canonical_name"),
        "short_label": rec.identity.get("short_label"),
        "category": rec.category,
        "description": rec.description,
        "verification_state": rec.verification.get("state"),
        "is_test_fixture": rec.is_test_fixture,
        "test_fixture_label": rec.test_fixture_label,
        "jurisdiction": rec.jurisdiction.model_dump(),
        "authority_name": rec.authority.name,
        "application_mode": rec.application.mode.value,
        "life_situations": list(rec.life_situations),
        "translations": rec.translations,
    }


def list_jurisdictions(*, include_test: bool = False) -> Dict[str, list[str]]:
    """Enumerate distinct jurisdiction facets in the visible discovery set."""
    corpus = list(get_production_registry())
    if include_test:
        corpus += list(get_test_fixtures())
    levels: set[str] = set()
    states: set[str] = set()
    for rec in corpus:
        levels.add(rec.jurisdiction.level)
        if rec.jurisdiction.state:
            states.add(rec.jurisdiction.state)
    return {"levels": sorted(levels), "states": sorted(states)}
