import os, json, asyncio, collections
from fastapi import WebSocket
from dotenv import load_dotenv
from openai import AsyncOpenAI
from prompts.infinite import infinite_system_prompt
from prompts.sample_data_string import sample_data_string

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def build_messages(sel, prev_ideas: list[str]):
    recent_block = "\n".join(f"- {txt}" for txt in prev_ideas) or "- (none yet)"
    return [
        {"role": "system", "content": f"{infinite_system_prompt}\n\nPervious ideas (max 30, newest last):\n{recent_block}"},
        {"role": "user",   "content":
            f"This is keyword which you are going to generate ideas related to this:\n Raw data point: {sel['raw']}\nCode: {sel['code']}\nTheme: {sel['theme']}\n\n" + sample_data_string
        },
    ]

async def generate_infinite_batches(ws: WebSocket, sel: dict):
    """끊임없이 5개 배치씩 생성해 객체 단위로 전송"""
    ws.state.recent = collections.deque(maxlen=30)
    running = True
    while running:
        # 1) OpenAI 스트리밍 호출
        stream = await client.chat.completions.create(
            model="gpt-4o-mini",
            stream=True,
            temperature=1.0,
            messages=build_messages(sel, list(ws.state.recent)),
        )

        buf = ""          # 스트림 텍스트 임시 저장
        async for chunk in stream:
            part = chunk.choices[0].delta.content or ""
            buf += part

            # 2) 줄 단위 버퍼링 → 완전한 JSON이면 파싱
            while "\n" in buf:
                line, buf = buf.split("\n", 1)
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                    print(obj)
                    await ws.send_json(obj)      # 3) 완전한 객체 push
                    ws.state.recent.append(obj["response"])
                except json.JSONDecodeError:
                    # 모델이 잘못된 JSON을 보냈을 때 무시
                    pass

        # 4) throttle — 0.5초 쉬고 다음 5개 생성
        try:
            for _ in range(5):           # Pause 신호 체크를 위해 0.1 × 5
                if not running:
                    break
                await asyncio.sleep(0.1)
        except asyncio.CancelledError:
            break

        # 5) 클라이언트 메시지로 running 플래그 제어
        running = getattr(ws.state, "running", True)
