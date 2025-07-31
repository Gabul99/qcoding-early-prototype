# main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from interactions.antagonistic import generate_antagonistic_reply
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

# 샘플 데이터 (실제로는 데이터베이스에서 가져올 예정)
SAMPLE_DATA = [
    {
        "id": "1",
        "type": "raw",
        "title": "User Sentiment Analysis",
        "description": "Raw sentiment data from social media posts",
        "content": "Positive: 65%, Negative: 20%, Neutral: 15%"
    },
    {
        "id": "2",
        "type": "raw",
        "title": "Engagement Metrics",
        "description": "Likes, shares, and comments data",
        "content": "Total engagement: 1.2M, Avg. engagement rate: 4.5%"
    },
    {
        "id": "3",
        "type": "code",
        "title": "Sentiment Classifier",
        "description": "Python code for sentiment analysis",
        "content": "def classify_sentiment(text):\n    # Sentiment analysis logic\n    return sentiment_score"
    },
    {
        "id": "4",
        "type": "code",
        "title": "Data Preprocessing",
        "description": "Data cleaning and normalization code",
        "content": "def preprocess_data(df):\n    # Data preprocessing steps\n    return cleaned_df"
    },
    {
        "id": "5",
        "type": "theme",
        "title": "Brand Perception",
        "description": "High-level brand sentiment themes",
        "content": "Trust, Innovation, Customer Service, Quality"
    },
    {
        "id": "6",
        "type": "theme",
        "title": "Content Performance",
        "description": "Content strategy insights",
        "content": "Video content performs 3x better than text posts"
    }
]

@app.get("/")
async def root():
    return {"message": "Social Media Data Analysis API", "version": "1.0.0"}

@app.get("/api/data-items")
async def get_data_items():
    """모든 데이터 아이템을 반환합니다."""
    return {"items": SAMPLE_DATA}

@app.get("/api/data-items/{item_id}")
async def get_data_item(item_id: str):
    """특정 데이터 아이템을 반환합니다."""
    for item in SAMPLE_DATA:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Data item not found")

from fastapi import FastAPI, HTTPException
from datetime import datetime
from pydantic import BaseModel

from interactions.antagonistic import generate_antagonistic_reply 

app = FastAPI()


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
async def process_interaction(interaction_type: str, request: InteractionRequest):
    """
    AI 인터랙션을 처리합니다.
    """
    if interaction_type == "antagonistic":
        # 별도 모듈에서 OpenAI 호출
        result_text = await generate_antagonistic_reply(request.item_data)

    elif interaction_type == "living-papers":
        result_text = (
            f"📄 Generated dynamic report for {request.item_data.title}:\n\n"
            f"## Analysis Summary\n- Key insights: {request.item_data.content}\n"
            "- Recommendations: Further investigation needed\n"
            "- Next steps: Validate with additional data sources"
        )

    elif interaction_type == "living-codes":
        result_text = (
            f"💻 Interactive code for {request.item_data.title}:\n\n```python\n"
            f"# Generated code based on {request.item_data.type} data\n"
            f"def analyze_{request.item_data.type}_data(data):\n"
            f"    # Interactive analysis logic\n"
            f"    result = process_data(data)\n"
            f"    return result\n```"
        )

    elif interaction_type == "infinite-generation":
        result_text = (
            f"∞ Infinite generation started for {request.item_data.title}:\n\n"
            f"Generating variations of {request.item_data.type} data...\n"
            f"- Variation 1: {request.item_data.content} (modified)\n"
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
