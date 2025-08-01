from __future__ import annotations

import asyncio
import os
from datetime import datetime

from pathlib import Path
from dotenv import load_dotenv
from prompts.livingpapers import livingpapers_system_prompt
from prompts.sample_data_string import sample_data_string
from openai import AsyncOpenAI

load_dotenv()  # .env 로부터 환경변수 주입

# 비동기 클라이언트 초기화
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ROOT_DIR   = Path(__file__).resolve().parents[2]
PAPERS_DIR = ROOT_DIR / "app" / "papers"
PDF_PATHS  = list(PAPERS_DIR.glob("*.pdf"))

async def generate_livingpapers_reply() -> str:
    system_prompt = livingpapers_system_prompt
    user_prompt = sample_data_string
    print("hi")

    try:

        # upload_tasks = [
        #   client.files.create(
        #     file=open(path, "rb"),
        #     purpose="user_data"
        #   ) for path in PDF_PATHS
        # ]
        # files = await asyncio.gather(*upload_tasks)
        # file_contents = [{"type": "file", "file": {"file_id": f.id}} for f in files]
        file_contents = [{"type": "file", "file": {"file_id": f}} for f in ["file-44BiP6rzqx2p2nuP3ifjm7", "file-JQZL5iVZ7EDEQhMT6Hbub6", "file-54ujaYx9AySXdoS45CpMQq", "file-FGCTH5zyJWYd17Txdo4DJ9", "file-HSyuQ1WAJy5yVnLSGsvkGw"]]

        user_content = file_contents + [{"type": "text", "text": user_prompt}]

        response = await client.chat.completions.create(
            model="o4-mini-2025-04-16",  # 사용 모델
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            temperature=1,
            max_completion_tokens=9046
        )
    except Exception as e:  # 네트워크나 quota 오류 대비
        print(e)
        return f"⚠️  Error contacting OpenAI: {e}"
    
    print("end", response)

    generated = response.choices[0].message.content.strip()
    return f"{generated}"
