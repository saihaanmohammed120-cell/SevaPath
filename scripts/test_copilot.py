import asyncio
import json
import httpx

async def test():
    async with httpx.AsyncClient() as client:
        payload = {
            "message": "I moved to a new city and want to update my Aadhaar address.",
            "language": "en"
        }
        res = await client.post("http://127.0.0.1:8000/api/copilot", json=payload, timeout=30.0)
        data = res.json()
        print("Test 1 (Natural Language Aadhaar):")
        print(f"Provider: {data.get('provider_used')}")
        print(f"Reason: {data.get('reason')}")
        print(f"Reply snippet: {data.get('reply')[:100]}...\n")

        payload = {
            "message": "passport",
            "language": "en"
        }
        res = await client.post("http://127.0.0.1:8000/api/copilot", json=payload, timeout=30.0)
        data = res.json()
        print("Test 2 (Passport short):")
        print(f"Provider: {data.get('provider_used')}")
        print(f"Reason: {data.get('reason')}")
        print(f"Reply snippet: {data.get('reply')[:100]}...\n")

if __name__ == "__main__":
    asyncio.run(test())
