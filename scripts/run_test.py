import sys
sys.path.insert(0, 'E:/Sevapath/backend')
from services.verified import VERIFIED_SERVICES
from services.schema import ServiceRecord

stages = ["Understand", "Confirm", "Eligibility", "Documents", "Procedure", "Application"]

print("FINAL TEST RESULTS:")
for s in VERIFIED_SERVICES:
    # Try parsing via schema to ensure data validity
    rec = ServiceRecord(**s)
    
    print(f"\nService: {rec.identity['short_label']}")
    # 1. Understand
    if rec.identity.get('short_label') and rec.description:
        print("Understand: PASS")
    else:
        print("Understand: FAIL")
        
    # 2. Confirm
    if rec.identity.get('canonical_name') and rec.authority.name and rec.description:
        print("Confirm: PASS")
    else:
        print("Confirm: FAIL")
        
    # 3. Eligibility
    if rec.eligibility_rules is not None:
        print("Eligibility: PASS")
    else:
        print("Eligibility: FAIL")
        
    # 4. Documents
    if rec.required_documents is not None:
        print("Documents: PASS")
    else:
        print("Documents: FAIL")
        
    # 5. Procedure
    if rec.procedure is not None:
        print("Procedure: PASS")
    else:
        print("Procedure: FAIL")
        
    # 6. Application
    if rec.application is not None and rec.official_sources is not None:
        print("Application: PASS")
    else:
        print("Application: FAIL")
