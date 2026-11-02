import sys
sys.path.insert(0, 'E:/Sevapath/backend')

from fastapi.testclient import TestClient
from server import app
import json

client = TestClient(app)

# The exact payload sent by Discover.jsx when clicking "lost-documents"
payload = {"query": "", "life_situation": "lost-documents"}

try:
    response = client.post("/api/services/search", json=payload)
    print("STATUS CODE:", response.status_code)
    print("RESPONSE BODY:", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
