"""Service discovery + eligibility endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional

from services import registry
from services.eligibility import evaluate

router = APIRouter(prefix="/services", tags=["services"])


class SearchRequest(BaseModel):
    query: Optional[str] = Field("", max_length=200)
    life_situation: Optional[str] = Field(None, max_length=100)
    include_test: bool = False


class EligibilityRequest(BaseModel):
    service_id: str = Field(..., max_length=100)
    answers: Dict[str, Any] = Field(..., max_length=100)


from services.localization import localize_record

@router.get("")
async def list_services(include_test: bool = Query(False), lang: str = Query("en")):
    records = registry.get_all_discoverable(include_test=include_test)
    localized_records = [localize_record(registry._summary(r), lang) for r in records]
    return {
        "count": len(records),
        "production_count": len(registry.get_production_registry()),
        "test_fixture_count": len(registry.get_test_fixtures()),
        "included_test_fixtures": include_test,
        "services": localized_records,
    }


@router.post("/search")
async def search_services(req: SearchRequest, lang: str = Query("en")):
    results = registry.search(
        req.query or "",
        life_situation=req.life_situation,
        include_test=req.include_test,
    )
    localized_results = [localize_record(r, lang) for r in results]
    return {
        "count": len(results),
        "included_test_fixtures": req.include_test,
        "results": localized_results,
    }


@router.get("/{service_id}")
async def get_service(service_id: str, lang: str = Query("en")):
    rec = registry.get_by_id(service_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Service not found")
    return localize_record(rec.model_dump(mode="json"), lang)


@router.post("/eligibility")
async def check_eligibility(req: EligibilityRequest, lang: str = Query("en")):
    rec = registry.get_by_id(req.service_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Service not found")
    
    localized_rec = localize_record(rec.model_dump(mode="json"), lang)
    rules = localized_rec.get("eligibility_rules", [])
    
    verdict = evaluate(rules, req.answers)
    verdict["service_id"] = localized_rec["id"]
    verdict["service_label"] = localized_rec.get("identity", {}).get("short_label")
    verdict["is_test_fixture"] = localized_rec.get("is_test_fixture", False)
    return verdict
