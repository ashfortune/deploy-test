from fastapi import FastAPI
import httpx
import time
from datetime import datetime

import os

app = FastAPI(title="Nexus Logic Gateway")

# 환경 변수로부터 Core 서비스 주소를 가져옵니다. (Docker 내부망 통신용)
CORE_SERVICE_HOST = os.getenv("CORE_SERVICE_HOST", "localhost")
CORE_SERVICE_URL = f"http://{CORE_SERVICE_HOST}:8080/api/core/info"

@app.get("/api/v1/health")
async def get_system_health():
    start_time = time.time()
    
    # Core 서비스(Spring Boot) 호출 시도
    core_status = "UNKNOWN"
    core_data = None
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(CORE_SERVICE_URL, timeout=2.0)
            if response.status_code == 200:
                core_data = response.json()
                core_status = "UP"
            else:
                core_status = "DOWN"
    except Exception as e:
        core_status = f"ERROR: {str(e)}"

    process_time = time.time() - start_time
    
    return {
        "gateway": {
            "name": "Nexus Gateway (FastAPI)",
            "status": "UP",
            "timestamp": datetime.now().isoformat(),
            "latency_ms": round(process_time * 1000, 2)
        },
        "core_service": {
            "status": core_status,
            "data": core_data
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
