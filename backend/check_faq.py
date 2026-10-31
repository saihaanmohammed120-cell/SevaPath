import sys
sys.path.append('e:/Sevapath/backend')
from services import registry
rec = registry.get_by_id('pan-card')
import json
with open('e:/Sevapath/backend/test_faq.json', 'w', encoding='utf-8') as f:
    json.dump(rec.model_dump(mode="json"), f, indent=2)
