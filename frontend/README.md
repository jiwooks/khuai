# 프론트엔드 로컬 개발 (macOS)

React 18.3.1 · Vite 5.4.8 · React Router 6.26.2 · JSX · 순수 CSS를 그대로 사용합니다. UI 리디자인을 위해 새 런타임 의존성을 추가하지 않았습니다.

## 현재 설정

- 작업 브랜치: `feat/figma-mobile-redesign` (main에 push/merge하지 않음)
- 확인한 환경: macOS 26.5, Node 24.17.0, npm 11.13.0
- 프론트엔드: <http://127.0.0.1:5173>
- 백엔드: <http://127.0.0.1:8000>, API 문서: <http://127.0.0.1:8000/docs>
- `/api` 요청은 기존 `vite.config.js`가 FastAPI 8000번 포트로 전달합니다. 배포용 API 경로와 `src/api.js`는 변경하지 않았습니다.
- 백엔드 소스와 requirements는 수정하지 않았습니다. Python 3.14에서 기존 SQLAlchemy 2.0.35의 typing 호환 오류가 발생하여, Python 3.12로 만든 `backend/venv`를 사용합니다. `backend/.venv`는 실패한 3.14 환경이므로 사용하지 않습니다.

## 실행

터미널 두 개를 열어 각각 실행하세요. 서버가 켜진 터미널은 그대로 두고, 종료할 때 `Control+C`를 누릅니다.

터미널 1 — 이미 준비한 백엔드 가상환경 실행:

```bash
cd /Users/ongyy/Documents/GitHub/khuai/backend
./venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

터미널 2 — 프론트엔드:

```bash
cd /Users/ongyy/Documents/GitHub/khuai/frontend
npm run dev -- --host 127.0.0.1
```

의존성을 새로 설치해야 한다면:

```bash
cd /Users/ongyy/Documents/GitHub/khuai/frontend
npm ci --cache /private/tmp/khuai-npm-cache
```

기본 npm 캐시에 쓰기 오류가 있어서 별도 캐시를 사용했습니다. sudo나 시스템 캐시 소유권 변경은 하지 않았습니다.

다른 Mac에서 백엔드 환경을 새로 만들 때는 Python 3.12를 사용하세요. 이 Mac의 `venv`는 Codex에 포함된 Python 3.12.14로 생성했습니다. Codex 설치 경로에 의존하고 싶지 않다면 공식 Python 3.12 또는 Homebrew의 `python@3.12`로 가상환경을 새로 만들 수 있습니다. 기존 DB를 지울 필요는 없습니다.

```bash
# Python 3.12 설치 후, 가상환경이 아직 없는 새 checkout에서만 실행
cd /path/to/khuai/backend
python3.12 -m venv venv
./venv/bin/python -m pip install -r requirements.txt
```

## 디자인 및 구현 범위

[Figma 최종 리디자인 보드](https://www.figma.com/design/3E7ezg2OLBqM3NxIx6TZC1/Untitled?node-id=7-556)를 기준으로 구현했습니다. 2026-10-30 확인 시 보드는 Pretendard와 개별 캐릭터 이미지로 보완된 상태였습니다.

| Figma 화면 | 기존 구현 위치 / 접근 |
|---|---|
| 역할 선택 | `/` · `src/RolePicker.jsx` |
| 농가 홈 | `/farmer` · `farmer/pages/Home.jsx` |
| 출하 요청 | `/farmer/orders` · `farmer/pages/Orders.jsx` |
| 출하 등록 | `/farmer/lot/new` · `farmer/pages/LotNew.jsx` |
| 정산 | `/farmer/settlement` · `farmer/pages/Settlement.jsx` |
| 농가 선택 | `/farmer/pick` · `farmer/pages/Pick.jsx` |
| 시작 화면 | `/store/welcome` · `store/pages/Welcome.jsx` |
| 자영업자 홈 | `/store` · `store/pages/Home.jsx` |
| 과일 마켓 | `/store/market` · `store/pages/Market.jsx` |
| 과일 상세 | 상품 카드 선택 · `store/components/Sheets.jsx` |
| 장바구니 | `/store/cart` · `store/pages/Cart.jsx` |
| AI 발주 추천 | `/store/ai?tab=rec` · `store/pages/AI.jsx` |
| 정기 발주 | `/store/ai?tab=sub` · `store/pages/AI.jsx` |
| AI 메뉴 제안 | `/store/ai?tab=menu` · `store/pages/AI.jsx` |
| 주문 내역 | `/store/orders` · `store/pages/Orders.jsx` |

15개 화면의 기능은 작업 전에도 구현되어 있었습니다. 새 프로젝트로 교체하거나 화면 기능을 새로 만들지 않고, 기존 컴포넌트와 동작을 유지하며 공통 CSS 스킨과 이미지, 화면 마크업을 개선했습니다.

- 공통 토큰: 민트 `#0DCD89`, 배경 `#F6F6F6`, 본문 `#121212`, 경계선 `#E8E8E8`, 카드/버튼 radius 10px.
- `styles.css` 기존 내용은 보존하고 마지막 Figma 블록에 재정의했습니다. `main.jsx`, API 모듈, Context, 백엔드, 라우트는 변경하지 않았습니다.
- 과일 이미지는 `shared/Fruit.jsx`, 캐릭터는 `shared/Character.jsx`, Figma 벡터 아이콘은 기존 `shared/Icon.jsx`를 통해 재사용합니다.
- 과일/캐릭터는 개별 콘텐츠 이미지이며 UI 전체를 스크린샷으로 구현하지 않았습니다. 이미지와 폰트는 `public/assets`에서 제공하며 임시 Figma URL을 사용하지 않습니다.
- 실제 API의 상품/농가/추천/메뉴 개수, 가격과 예측값은 그대로 표시합니다. Figma에 찍힌 데모 수치로 API 데이터를 덮어쓰지 않았습니다. 따라서 화면에 따라 항목 수와 높이가 Figma의 고정 예시와 다릅니다.
- 기존 추가 기능(누적 절감액, 출하 등록 2·3단계, 매장 변경, 상품 상세 창, 품질 평가, 데모 주문 진행)을 유지했습니다. 기존 자동 농가·카페 선택도 유지하므로 선택 화면을 보려면 위 직접 주소로 들어갑니다.
- 정산·시세와 출하 사진 추천은 기존 데모 데이터/목업입니다. 출하 로트는 기존대로 로컬 state이며 영구 DB 모델은 없습니다. 실제 요청 수락·출고 및 출하 가능량은 기존 API로 처리합니다.

## 확인 명령어

```bash
cd /Users/ongyy/Documents/GitHub/khuai/frontend
npm run build
# 프론트와 백엔드 서버가 모두 켜진 상태에서
node scripts/smoke.mjs
```

smoke 스크립트는 기존 API 13개와 Vite 프록시를 읽기 전용으로 검사합니다. 브라우저 조작 검증과는 별개입니다.

## 팀 작업 시

`CLAUDE.md`의 자영업자 수정 금지/임시 글래스모피즘 유지 규칙은 이전 파트 분업 지침입니다. 이번 전체 리디자인 요청 범위에서 UI 파일만 수정했고, Context·API·백엔드는 보존했습니다. main 직접 push/merge 없이 이 브랜치의 diff를 팀원과 검토하세요.
