from __future__ import annotations

import os
from datetime import datetime

import openai
from dotenv import load_dotenv
from prompts.antagonistic import antagonistic_system_prompt
from prompts.sample_data_string import sample_data_string
from openai import AsyncOpenAI

load_dotenv()  # .env 로부터 환경변수 주입

# 비동기 클라이언트 초기화
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_antagonistic_reply() -> str:
    system_prompt = antagonistic_system_prompt
    user_prompt = sample_data_string
    print("hi")

    try:
        response = await client.chat.completions.create(
            model="o4-mini-2025-04-16",  # 사용 모델
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
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
