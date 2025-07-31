from __future__ import annotations

import os
from datetime import datetime

import openai
from dotenv import load_dotenv
from prompts.antagonistic import antagonistic_system_prompt

load_dotenv()  # .env 로부터 환경변수 주입

# 비동기 클라이언트 초기화
openai.api_key = os.getenv("OPENAI_API_KEY")


async def generate_antagonistic_reply(item_data) -> str:
    system_prompt = antagonistic_system_prompt
    user_prompt = (
        f"Here is some {item_data.type} data titled '{item_data.title}'. "
        f"Content:\n{item_data.content}\n\n"
        "Generate a short antagonistic critique pointing out at least one potential bias "
        "or methodological flaw. Use an informal, slightly sarcastic tone and add one emoji."
    )

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",  # 사용 모델
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.9,
            max_tokens=1024,
            timeout=20,
        )
    except Exception as e:  # 네트워크나 quota 오류 대비
        return f"⚠️  Error contacting OpenAI: {e}"

    generated = response.choices[0].message.content.strip()
    return f"{generated}"
