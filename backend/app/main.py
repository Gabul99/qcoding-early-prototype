# main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from interactions.antagonistic import generate_antagonistic_reply
from interactions.livingpapers import generate_livingpapers_reply
import json

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 모델 정의
class DataItem(BaseModel):
    id: str
    type: str  # 'raw', 'code', 'theme'
    title: str
    description: str
    content: str

class InteractionRequest(BaseModel):
    item_id: str
    interaction_type: str  # 'antagonistic', 'living-papers', 'living-codes', 'infinite-generation'
    item_data: DataItem

class InteractionResponse(BaseModel):
    result: str
    timestamp: str
    interaction_type: str


class ItemData(BaseModel):
    title: str
    type: str
    content: str


class InteractionRequest(BaseModel):
    item_data: ItemData


class InteractionResponse(BaseModel):
    result: str
    timestamp: str
    interaction_type: str


@app.post("/api/interactions/{interaction_type}")
async def process_interaction(interaction_type: str):
    """
    AI 인터랙션을 처리합니다.
    """
    if interaction_type == "antagonistic":
        # 별도 모듈에서 OpenAI 호출
        result_text = await generate_antagonistic_reply()

    elif interaction_type == "living-papers":
        result_text = await generate_livingpapers_reply()

    elif interaction_type == "living-codes":
        result_text = (
            f"💻 Interactive code for :\n\n```python\n"
            f"# Generated code based on  data\n"
            f"def analyze_data(data):\n"
            f"    # Interactive analysis logic\n"
            f"    result = process_data(data)\n"
            f"    return result\n```"
        )

    elif interaction_type == "infinite-generation":
        result_text = (
            f"∞ Infinite generation started for :\n\n"
            f"Generating variations of  data...\n"
            f"- Variation 1:  (modified)\n"
            f"- Variation 2: Alternative approach\n"
            f"- Variation 3: Extended analysis\n..."
        )

    else:
        raise HTTPException(status_code=400, detail="Invalid interaction type")

    return InteractionResponse(
        result=result_text,
        timestamp=datetime.utcnow().isoformat(),
        interaction_type=interaction_type,
    )


@app.get("/api/interaction-types")
async def get_interaction_types():
    """사용 가능한 인터랙션 타입들을 반환합니다."""
    return {
        "types": [
            {
                "id": "antagonistic",
                "label": "Antagonistic",
                "emoji": "😤",
                "description": "Challenge and question the data"
            },
            {
                "id": "living-papers",
                "label": "Living Papers",
                "emoji": "📄",
                "description": "Dynamic document generation"
            },
            {
                "id": "living-codes",
                "label": "Living Codes",
                "emoji": "💻",
                "description": "Interactive code exploration"
            },
            {
                "id": "infinite-generation",
                "label": "Infinite Generation",
                "emoji": "∞",
                "description": "Continuous data generation"
            }
        ]
    }

# 기존 Google Sheets 훅 (유지)
@app.post("/sheet-hook")
async def sheet_hook(req: Request):
    payload = await req.json()
    print("📌  Sheet event:", payload, "| received at", datetime.utcnow().isoformat())
    return {"status": "ok"}
