import asyncio
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        resp = await client.post('http://127.0.0.1:8001/api/services/search', json={"query": "", "life_situation": "lost-documents"})
        print(resp.status_code)
        print(resp.text)

if __name__ == "__main__":
    asyncio.run(main())
