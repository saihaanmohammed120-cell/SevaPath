import sys
import json
sys.path.insert(0, 'E:/Sevapath/backend')
from services import registry

try:
    results = registry.search(query="", life_situation="lost-documents", include_test=False)
    with open('E:/Sevapath/test_out.json', 'w') as f:
        json.dump(results, f)
except Exception as e:
    with open('E:/Sevapath/test_out.txt', 'w') as f:
        f.write(str(e))
