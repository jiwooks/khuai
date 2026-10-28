# 과일잇다

AI 기반 영세 과일 농가 ↔ 자영업자 직거래 플랫폼 (2026 KHU AI Challenge · AI 문제해결 솔루션 부문)

경매·중도매 단계를 앱이 대신합니다. 생산자와 자영업자는 과일잇다 앱만 보고, 농가 매칭은 AI가 합니다.

## 역할 분담

| 파트 | 담당 | 프론트엔드 | 백엔드 |
|---|---|---|---|
| 자영업자 앱 | 박보경 | `frontend/src/store/` (`/store`) | `backend/app/routers/store.py` |
| 생산자 앱 | 팀원 | `frontend/src/farmer/` (`/farmer`) | `backend/app/routers/farmer.py` |
| 공용 | 함께 | `frontend/src/shared/` | `models.py`, `services/`, `routers/catalog.py` |

두 파트는 **ShipmentRequest(출하 요청)** 로 연결됩니다. 자영업자가 주문하면 AI 매칭이 농가를 고르고 출하 요청을 만들고,
농가가 요청을 수락·출고하면(`PATCH /api/farmer/requests/{id}`) 자영업자 주문 단계도 같이 진행됩니다.

## 기술 스택

- 프론트엔드: React 18 + Vite, React Router
- 백엔드: FastAPI + SQLAlchemy 2 + SQLite
- AI: Holt 선형 지수평활 수요예측(`services/forecast.py`), 농가 매칭 점수(`services/matching.py`), 제철 메뉴·원가 계산(`services/menu.py`)

## 로컬 실행

필요: Python 3.10+, Node.js 18+

```bash
# 1) 백엔드 (터미널 1)
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2) 프론트엔드 (터미널 2)
cd frontend
npm install
npm run dev
```

- 앱: http://localhost:5173/store
- API 문서(Swagger): http://localhost:8000/docs
- 처음 실행하면 `backend/gwailitda.db`에 데모 데이터가 자동으로 들어갑니다. 초기화하려면 이 파일을 지우고 다시 실행하세요.

## 기능 (자영업자 앱)

| 기능 | 화면 | API |
|---|---|---|
| 매장 선택(데모) | 시작하기 | `GET /api/stores` |
| 홈: AI 추천·진행 중 주문·누적 절감액 | 홈 | `GET /api/stores/{id}/home` |
| 과일 마켓·검색·필터 | 마켓 | `GET /api/fruits?q=&filter=all\|mine\|rising\|ugly` |
| 과일 상세·AI 농가 매칭 후보 | 과일 카드 | `GET /api/fruits/{id}` |
| 장바구니·주문(도착 시간·결제 방법) | 장바구니 | `POST /api/stores/{id}/orders` |
| 주문 추적·매칭 결과 | 주문 | `GET /api/stores/{id}/orders`, `POST /api/orders/{code}/advance`(데모) |
| 품질 평가 → 농가 평점 반영 | 주문 | `POST /api/orders/{code}/review` |
| AI 발주 추천 | AI › 발주 추천 | `GET /api/stores/{id}/forecast` |
| 정기 발주 | AI › 정기 발주 | `GET/POST /api/stores/{id}/subscriptions`, `PATCH/DELETE /api/subscriptions/{id}` |
| AI 제철 메뉴 제안 | AI › 메뉴 제안 | `GET /api/stores/{id}/menu-ideas` |

## 생산자 파트용 API (시작점)

| API | 설명 |
|---|---|
| `GET /api/farmer/farms` | 농가 목록과 품목별 공급량 |
| `GET /api/farmer/farms/{id}/requests` | 받은 출하 요청 |
| `PATCH /api/farmer/requests/{id}` | `{ "status": "accepted" \| "shipped" }` |
| `PATCH /api/farmer/supplies/{id}` | 주간 생산량·출하 가능량 수정 |
| `GET /api/farmer/demand` | 품목별 다음 주 예상 수요 (전체 매장 합계) |

## 배포 (Render)

1. 이 저장소를 GitHub에 push
2. https://render.com → New → Blueprint → 저장소 선택 (`render.yaml` 사용)
3. 배포가 끝나면 `https://<서비스이름>.onrender.com/store` 로 접속

Docker 하나로 프론트 빌드와 API 서버를 같이 띄웁니다. 무료 플랜은 재시작 시 DB가 초기화되어 데모 데이터로 돌아갑니다.

## 데이터

모든 가격·농가·매장·주문 수치는 데모용 가상 데이터입니다 (`backend/app/seed.py`).
