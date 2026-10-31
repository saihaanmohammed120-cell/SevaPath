"""Security tests for SevaPath endpoints and internal boundaries."""
import pytest
from fastapi.testclient import TestClient
from server import app
from services.schema import validate_safe_url, ServiceRecord
from services import registry
from pydantic import ValidationError

client = TestClient(app, raise_server_exceptions=False)

def test_oversized_search_query():
    # 1. oversized search query -> 422
    response = client.post("/api/services/search", json={"query": "A" * 201})
    assert response.status_code == 422

def test_oversized_copilot_message():
    # 2. oversized copilot message -> 422
    response = client.post("/api/copilot", json={"message": "A" * 1001})
    assert response.status_code == 422

def test_excessive_history():
    # 3. excessive history -> 422
    history = [{"role": "user", "content": "hello"} for _ in range(21)]
    response = client.post("/api/copilot", json={"message": "hi", "history": history})
    assert response.status_code == 422

def test_oversized_history_item():
    # 4. oversized history item -> 422
    response = client.post("/api/copilot", json={
        "message": "hi",
        "history": [{"role": "user", "content": "A" * 2001}]
    })
    assert response.status_code == 422

def test_invalid_history_role():
    # 5. invalid history role -> 422
    response = client.post("/api/copilot", json={
        "message": "hi",
        "history": [{"role": "hacker", "content": "test"}]
    })
    assert response.status_code == 422

def test_malformed_json():
    # 6. malformed JSON -> safe 4xx response
    response = client.post(
        "/api/copilot",
        data="{'invalid': json}",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code in [400, 422]

def test_url_rejections():
    # 7. javascript:, 8. data:, 9. file:, 10. non-HTTPS
    with pytest.raises(ValueError, match="Unsafe URL scheme"):
        validate_safe_url("javascript:alert(1)")
    with pytest.raises(ValueError, match="Unsafe URL scheme"):
        validate_safe_url("data:text/html,<html>")
    with pytest.raises(ValueError, match="Unsafe URL scheme"):
        validate_safe_url("file:///etc/passwd")
    with pytest.raises(ValueError, match="Official sources must use HTTPS"):
        validate_safe_url("http://example.com")
    
    # Allowed
    assert validate_safe_url("https://example.com") == "https://example.com"
    assert validate_safe_url("http://localhost:3000/") == "http://localhost:3000/"

def test_test_only_fixture_isolation():
    # 11. TEST_ONLY fixture isolation
    # 17. production service discovery remains free of TEST_ONLY services
    response = client.get("/api/services?include_test=false")
    assert response.status_code == 200
    services = response.json()["services"]
    for srv in services:
        assert not srv.get("is_test_fixture", False)

def test_sanitized_500_response(monkeypatch):
    # 12. sanitized unexpected 500 response
    def mock_broken_endpoint(*args, **kwargs):
        raise RuntimeError("Secret internal database password failure!")
    
    monkeypatch.setattr("routes.services.registry.get_all_discoverable", mock_broken_endpoint)
    
    response = client.get("/api/services")
    assert response.status_code == 500
    data = response.json()
    assert "Internal server error" in data["detail"]
    assert "Secret internal" not in str(data)

def test_security_headers():
    # 13. required security headers
    response = client.get("/api/health")
    headers = response.headers
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert "default-src" in headers.get("Content-Security-Policy", "")

def test_rate_limit(monkeypatch):
    # 14. rate limit -> 429
    # Mock provider so requests run instantly and don't refill the token bucket due to network latency
    async def mock_complete(*args, **kwargs):
        return {"text": "mock", "provider_used": "mock", "model_used": "mock"}
    monkeypatch.setattr("routes.copilot.complete", mock_complete)
    
    # Ensure a fresh bucket
    monkeypatch.setattr("routes.copilot._rate_limits", {})
    
    # The limit is 10 tokens. We fire 11 requests.
    for _ in range(10):
        client.post("/api/copilot", json={"message": "hello"})
    
    res = client.post("/api/copilot", json={"message": "hello"})
    assert res.status_code == 429
    assert res.json()["detail"] == "Too many requests"

def test_provider_failure_sanitized(monkeypatch):
    # 15. provider failure is sanitized
    async def mock_broken_complete(*args, **kwargs):
        raise ValueError("Gemini HTTP 403 (provider=gemini, model=gemini-3.6-flash)")
    monkeypatch.setattr("routes.copilot.complete", mock_broken_complete)
    
    # Wait for rate limit from previous test to clear
    monkeypatch.setattr("routes.copilot._rate_limits", {})
    
    # The route shouldn't convert provider failure to 200. It should return 502/503.
    # With raise_server_exceptions=False, TestClient returns 500 for unhandled exceptions.
    # But if we want a 502/503, the route must handle it. We will assert 502.
    response = client.post("/api/copilot", json={"message": "test"})
    assert response.status_code == 502
    assert "Provider unavailable" in response.json()["detail"]

def test_ai_cannot_inject_untrusted_official_url():
    # 16. AI cannot create/inject an untrusted official application URL
    # Construct a valid ServiceRecord to prove the boundary independently of fixtures
    safe_data = {
        "id": "test-service",
        "slug": "test-service-slug",
        "category": "test-category",
        "description": "A test service",
        "jurisdiction": {"level": "central"},
        "authority": {"name": "Test Authority"},
        "application": {
            "mode": "online",
            "official_url": "https://safe.example.com"
        }
    }
    
    record = ServiceRecord(**safe_data)
    assert record.application.official_url == "https://safe.example.com"
    
    # Simulate AI attempting to construct or inject an unsafe URL structure
    unsafe_data = safe_data.copy()
    unsafe_data["application"] = {
        "mode": "online",
        "official_url": "javascript:alert(1)"
    }
    
    with pytest.raises(ValidationError) as exc_info:
        ServiceRecord(**unsafe_data)
    assert "Unsafe URL scheme" in str(exc_info.value)
