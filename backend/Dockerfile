# 베이스 이미지
FROM python:3.11-slim

# 시스템 패키지 설치 (필요 시)
RUN apt-get update && apt-get install -y curl build-essential && rm -rf /var/lib/apt/lists/*

# Poetry 설치
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# 작업 디렉토리 설정
WORKDIR /app
ENV PYTHONPATH=/app/app

# pyproject.toml 복사 후 의존성 설치
COPY pyproject.toml ./
COPY poetry.lock ./
RUN poetry install --no-root --only main

# 전체 앱 복사
COPY . .

# FastAPI 실행
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
