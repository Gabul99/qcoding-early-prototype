# Social Media Data Analysis AI Interaction Prototype

소셜 미디어 데이터 분석을 위한 AI 인터랙션 프로토타입입니다. 사용자가 데이터 아이템을 선택하고 4가지 타입의 AI 인터랙션을 통해 데이터를 탐색할 수 있습니다.

## 기능

### 데이터 아이템 타입

- **Raw Data**: 원시 소셜 미디어 데이터 (감정 분석, 참여도 지표 등)
- **Code**: 데이터 처리 및 분석 코드
- **Theme**: 고수준 주제 및 인사이트

### AI 인터랙션 타입

- **😤 Antagonistic**: 데이터에 대해 도전적이고 의문을 제기하는 방식
- **📄 Living Papers**: 동적 문서 생성
- **💻 Living Codes**: 대화형 코드 탐색
- **∞ Infinite Generation**: 연속적인 데이터 생성

## 기술 스택

### Frontend

- React 19
- TypeScript
- Tailwind CSS
- Lucide React (아이콘)
- Vite

### Backend

- FastAPI
- Python 3.13+
- Pydantic

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd qcoding-prototype
```

### 2. 백엔드 설정

```bash
cd backend
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

### 4. 접속

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## API 엔드포인트

### 데이터 아이템

- `GET /api/data-items` - 모든 데이터 아이템 조회
- `GET /api/data-items/{item_id}` - 특정 데이터 아이템 조회

### 인터랙션

- `POST /api/interactions/{interaction_type}` - AI 인터랙션 처리
- `GET /api/interaction-types` - 사용 가능한 인터랙션 타입 조회

## 프로젝트 구조

```
qcoding-prototype/
├── backend/
│   ├── app/
│   │   └── main.py          # FastAPI 애플리케이션
│   └── pyproject.toml       # Python 의존성
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # 메인 React 컴포넌트
│   │   ├── index.css        # 전역 스타일
│   │   └── main.tsx         # React 진입점
│   ├── package.json         # Node.js 의존성
│   └── tailwind.config.js   # Tailwind CSS 설정
└── README.md
```

## 사용법

1. **데이터 아이템 선택**: 왼쪽 패널에서 원하는 데이터 아이템을 클릭합니다.
2. **인터랙션 타입 선택**: 오른쪽 상단의 4개 인터랙션 버튼 중 하나를 선택합니다.
3. **결과 확인**: 선택한 인터랙션에 대한 AI 응답을 하단에서 확인합니다.

## 개발 계획

- [ ] 실제 AI 모델 연동
- [ ] 데이터베이스 연동
- [ ] 사용자 인증 시스템
- [ ] 인터랙션 히스토리 저장
- [ ] 실시간 데이터 업데이트

## 라이선스

MIT License
