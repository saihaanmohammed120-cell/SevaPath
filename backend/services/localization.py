def localize_record(rec: dict, lang: str) -> dict:
    """Overlays localized strings onto a ServiceRecord dictionary."""
    if not lang or lang == "en":
        return rec
    
    # We must operate on a copy of the dictionary, not mutate the cached registry!
    # A deep copy is needed because we're modifying nested structures.
    import copy
    rec = copy.deepcopy(rec)
    
    translations = rec.get("translations", {}).get(lang)
    if not translations:
        rec["_fallback_fields"] = True
        return rec
        
    # Only expect translations for fields that actually exist in the English record
    expected_keys = []
    for k in ["identity", "description", "eligibility_rules", "required_documents", "procedure", "application"]:
        if rec.get(k):
            expected_keys.append(k)
            
    if any(k not in translations for k in expected_keys):
        rec["_fallback_fields"] = True
        
    # Translate Identity
    if "identity" in translations:
        if "short_label" in translations["identity"]:
            if "identity" in rec:
                rec["identity"]["short_label"] = translations["identity"]["short_label"]
            else:
                rec["short_label"] = translations["identity"]["short_label"]
        if "canonical_name" in translations["identity"]:
            if "identity" in rec:
                rec["identity"]["canonical_name"] = translations["identity"]["canonical_name"]
            else:
                rec["canonical_name"] = translations["identity"]["canonical_name"]
            
    # Translate Description
    if "description" in translations:
        rec["description"] = translations["description"]
        
    # Translate Eligibility Rules
    if "eligibility_rules" in translations:
        rules_map = {r["id"]: r for r in rec.get("eligibility_rules", [])}
        for tr_rule in translations["eligibility_rules"]:
            rule_id = tr_rule.get("id")
            if rule_id in rules_map:
                if "question" in tr_rule:
                    rules_map[rule_id]["question"] = tr_rule["question"]
                if "explanation" in tr_rule:
                    rules_map[rule_id]["explanation"] = tr_rule["explanation"]
                if "options" in tr_rule and rules_map[rule_id].get("options"):
                    # Assuming options map 1-to-1 by index
                    if len(tr_rule["options"]) == len(rules_map[rule_id]["options"]):
                        rules_map[rule_id]["options"] = tr_rule["options"]
                        
    # Translate Documents
    if "required_documents" in translations:
        docs_map = {d["id"]: d for d in rec.get("required_documents", [])}
        for tr_doc in translations["required_documents"]:
            doc_id = tr_doc.get("id")
            if doc_id in docs_map:
                if "name" in tr_doc:
                    docs_map[doc_id]["name"] = tr_doc["name"]
                if "description" in tr_doc:
                    docs_map[doc_id]["description"] = tr_doc["description"]
                if "alternatives" in tr_doc and "alternatives" in docs_map[doc_id]:
                    if len(tr_doc["alternatives"]) == len(docs_map[doc_id]["alternatives"]):
                        docs_map[doc_id]["alternatives"] = tr_doc["alternatives"]
                        
    # Translate Procedure
    if "procedure" in translations:
        # Assuming procedure matches by 'step' index
        proc_map = {p["step"]: p for p in rec.get("procedure", [])}
        for tr_step in translations["procedure"]:
            step_id = tr_step.get("step")
            if step_id in proc_map:
                if "title" in tr_step:
                    proc_map[step_id]["title"] = tr_step["title"]
                if "description" in tr_step:
                    proc_map[step_id]["description"] = tr_step["description"]
                    
    # Translate Application
    if "application" in translations and rec.get("application"):
        if "offline_instructions" in translations["application"]:
            rec["application"]["offline_instructions"] = translations["application"]["offline_instructions"]

    # Translate FAQs
    if "faqs" in translations:
        faqs_map = {f["id"]: f for f in rec.get("faqs", [])}
        for tr_faq in translations["faqs"]:
            faq_id = tr_faq.get("id")
            if faq_id in faqs_map:
                if "question" in tr_faq:
                    faqs_map[faq_id]["question"] = tr_faq["question"]
                if "answer" in tr_faq:
                    faqs_map[faq_id]["answer"] = tr_faq["answer"]

    # Optional: fees and deadlines
    if "fees" in translations:
        rec["fees"] = translations["fees"]
    if "deadlines" in translations:
        rec["deadlines"] = translations["deadlines"]
        
    return rec
