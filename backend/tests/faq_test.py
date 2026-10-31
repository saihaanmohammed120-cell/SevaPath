import pytest
from pydantic import ValidationError
from services.schema import ServiceRecord, FAQ
from services.verified import VERIFIED_SERVICES
from services.registry import TEST_ONLY_SERVICES

def test_faq_schema_validation():
    # Valid FAQ
    faq = FAQ(
        id="faq-01",
        question="Is this valid?",
        answer="Yes.",
        category="eligibility",
        source_name="Official",
        source_url="https://example.com",
        verification_status="verified",
        verified_at="2026-02-15"
    )
    assert faq.id == "faq-01"

    # Invalid Category
    with pytest.raises(ValidationError):
        FAQ(
            id="faq-02",
            question="Invalid?",
            answer="Yes.",
            category="random_category",
            verification_status="verified"
        )
    
    # Invalid Verification Status
    with pytest.raises(ValidationError):
        FAQ(
            id="faq-03",
            question="Invalid?",
            answer="Yes.",
            category="general",
            verification_status="certified"
        )

def test_verified_services_have_faqs():
    required_slugs = [
        "aadhaar-address-update-online", "passport-application", "voter-id-registration",
        "digilocker-account", "pan-card-online", "driving-licence-permanent",
        "uan-activation", "ayushman-bharat-pmjay"
    ]
    for svc in VERIFIED_SERVICES:
        if svc["slug"] in required_slugs:
            # Ensure every required production service has at least one FAQ
            assert "faqs" in svc, f"Service {svc['slug']} missing faqs"
            assert len(svc["faqs"]) > 0, f"Service {svc['slug']} faqs is empty"

            faq_ids = set()
            for f in svc["faqs"]:
                # Check for uniqueness
                assert f["id"] not in faq_ids
                faq_ids.add(f["id"])
                
                # Verified FAQs must have a date and HTTPS source
                if f["verification_status"] == "verified":
                    assert f.get("verified_at") is not None
                    url = str(f.get("source_url"))
                    assert url.startswith("https://")

def test_test_fixtures_do_not_leak():
    # Only test fixtures are in TEST_ONLY_SERVICES
    for svc in TEST_ONLY_SERVICES:
        assert svc.get("is_test_fixture") is True

    # No test fixtures in VERIFIED_SERVICES unless explicitly marked
    for svc in VERIFIED_SERVICES:
        assert svc.get("is_test_fixture") is False
