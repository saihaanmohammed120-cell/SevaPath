"""
Deterministic eligibility engine.

Receives (rules, user_answers) and returns a structured, deterministic
verdict.  AI is not involved in the decision — AI may only explain the
result.

SAFETY NOTE
-----------
Predicates are NOT evaluated as Python expressions.  This module
NEVER calls `eval`, `exec`, or `compile`.  Only the operators listed
in ``_ALLOWED_OPS`` are honoured; every other operator is treated as
an invalid rule and fails closed (returns False, contributing to an
"ineligible" verdict).  The whitelist is the boundary that keeps
user-authored answers and (hypothetical) untrusted rule sources
from executing arbitrary code.
"""
from __future__ import annotations

from numbers import Number
from typing import Any, Callable, Dict, List

# Whitelist of allowed operators.  Adding an operator here is a
# deliberate decision — do not extend at runtime.
_ALLOWED_OPS: Dict[str, Callable[[Any, Any], bool]] = {
    "eq":  lambda v, t: v == t,
    "neq": lambda v, t: v != t,
    "gte": lambda v, t: _num(v) is not None and _num(t) is not None and _num(v) >= _num(t),
    "lte": lambda v, t: _num(v) is not None and _num(t) is not None and _num(v) <= _num(t),
    "in":  lambda v, t: isinstance(t, (list, tuple, set)) and v in t,
}


def _num(x: Any):
    """Return a float if ``x`` looks numeric, else None.  Never coerces
    strings that could contain expression-like content."""
    if isinstance(x, bool):
        return None  # avoid True/False → 1/0 confusion in comparisons
    if isinstance(x, Number):
        return float(x)
    return None


def _apply_predicate(predicate: Any, value: Any) -> bool:
    """Return True iff the predicate matches.

    Any malformed predicate (wrong type, unknown op, missing 'value')
    fails closed.  We never raise from this function so that a single
    bad rule cannot break an entire eligibility check.
    """
    if not isinstance(predicate, dict):
        return False
    op = predicate.get("op")
    if op not in _ALLOWED_OPS:
        return False
    if "value" not in predicate:
        return False
    try:
        return bool(_ALLOWED_OPS[op](value, predicate["value"]))
    except Exception:  # noqa: BLE001 — defensive: never trust rule data
        return False


def evaluate(rules: List[dict], answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    rules  : list of eligibility rule dicts (see ServiceRecord schema)
    answers: {rule_id: user_answer}

    Returns:
      {
        eligible: bool,          # True only if every answered rule passes
        complete: bool,          # True only if every rule has an answer
        results: [ {id, passed, answered, explanation, question}, ... ],
        failing_rules: [rule_id, ...],
        unanswered_rules: [rule_id, ...],
      }
    """
    results = []
    failing: List[dict] = []
    unanswered: List[dict] = []

    for rule in rules:
        rid = rule["id"]
        answered = rid in answers and answers[rid] is not None
        passed = False
        if answered:
            passed = _apply_predicate(rule.get("predicate"), answers[rid])
            if not passed:
                failing.append({
                    "id": rid,
                    "question": rule["question"],
                    "explanation": rule["explanation"]
                })
        else:
            unanswered.append({
                "id": rid,
                "question": rule["question"],
                "explanation": rule["explanation"]
            })

        results.append({
            "id": rid,
            "question": rule["question"],
            "answered": answered,
            "passed": passed,
            "explanation": rule["explanation"],
        })

    complete = len(unanswered) == 0
    eligible = complete and len(failing) == 0

    return {
        "eligible": eligible,
        "complete": complete,
        "results": results,
        "failing_rules": failing,
        "unanswered_rules": unanswered,
    }
