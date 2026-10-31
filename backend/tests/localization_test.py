"""Tests for API-edge localization of ServiceRecords."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://127.0.0.1:8001").rstrip("/")
API = f"{BASE_URL}/api"

@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


class TestLocalization:
    def test_list_services_default_en(self, s):
        r = s.get(f"{API}/services?include_test=true")
        assert r.status_code == 200
        services = r.json().get("services", [])
        
        test_fixture = next((srv for srv in services if srv["id"] == "TEST_ONLY-learners-licence-demo"), None)
        assert test_fixture is not None
        assert test_fixture["short_label"] == "Learner's Licence"

    def test_list_services_hindi(self, s):
        r = s.get(f"{API}/services?include_test=true&lang=hi")
        assert r.status_code == 200
        services = r.json().get("services", [])
        
        test_fixture = next((srv for srv in services if srv["id"] == "TEST_ONLY-learners-licence-demo"), None)
        assert test_fixture is not None
        assert test_fixture["short_label"] == "लर्निंग लाइसेंस"
        assert test_fixture["canonical_name"] == "लर्निंग लाइसेंस (TEST_ONLY demo)"
        assert test_fixture["description"] == "लर्निंग लाइसेंस प्रवाह का एक काल्पनिक उदाहरण।"

    def test_get_service_hindi(self, s):
        r = s.get(f"{API}/services/TEST_ONLY-learners-licence-demo?lang=hi")
        assert r.status_code == 200
        svc = r.json()
        assert svc["identity"]["short_label"] == "लर्निंग लाइसेंस"
        assert svc["identity"]["canonical_name"] == "लर्निंग लाइसेंस (TEST_ONLY demo)"
        assert svc["description"] == "लर्निंग लाइसेंस प्रवाह का एक काल्पनिक उदाहरण।"
        
        # Test nested properties (rules, documents)
        age_rule = next((rule for rule in svc["eligibility_rules"] if rule["id"] == "age-16"), None)
        assert age_rule is not None
        assert age_rule["question"] == "क्या आपकी आयु कम से कम 16 वर्ष है?"
        assert age_rule["explanation"] == "आवेदकों की आयु कम से कम 16 वर्ष होनी चाहिए।"
        
        id_doc = next((doc for doc in svc["required_documents"] if doc["id"] == "identity-proof"), None)
        assert id_doc is not None
        assert id_doc["name"] == "पहचान प्रमाण"

    def test_check_eligibility_hindi(self, s):
        payload = {
            "service_id": "TEST_ONLY-learners-licence-demo",
            "answers": {"age-16": False}
        }
        r = s.post(f"{API}/services/eligibility?lang=hi", json=payload)
        assert r.status_code == 200
        verdict = r.json()
        assert verdict["service_label"] == "लर्निंग लाइसेंस"
        
        # Ineligible rule explanation should be translated
        assert len(verdict["failing_rules"]) > 0
        failed_rule = next((rule for rule in verdict["failing_rules"] if rule["id"] == "age-16"), None)
        assert failed_rule is not None
        assert failed_rule["explanation"] == "आवेदकों की आयु कम से कम 16 वर्ष होनी चाहिए।"

    def test_fallback_missing_translation(self, s):
        # Requesting a language (ta) that doesn't have translations yet for this fixture 
        # should fall back to English cleanly without crashing
        r = s.get(f"{API}/services/TEST_ONLY-learners-licence-demo?lang=ta")
        assert r.status_code == 200
        svc = r.json()
        assert svc["identity"]["short_label"] == "Learner's Licence"
        assert svc["description"].startswith("A fictional example of a learner's licence flow")
