# 과일잇다 (khuai) — 작업 규칙

AI 기반 영세 과일 농가 ↔ 자영업자 직거래 플랫폼. 2026 KHU AI Challenge 출품작.
**마감: 2026-10-30(금) 17:00.** 본선 발표 5분 시연이 최종 목표.

## 담당 범위

| 파트 | 담당 | 경로 |
|---|---|---|
| 자영업자 앱 | 박보경 — **완성됨. 건드리지 말 것** | `frontend/src/store/` |
| 생산자(농가) 앱 | 나 | `frontend/src/farmer/` |
| 공용 | 함께 | `frontend/src/shared/`, `styles.css`, `main.jsx` |

**`frontend/src/store/` 안의 파일은 읽기 전용으로 취급한다.** 참고는 하되 수정 금지.
`styles.css`와 `main.jsx`는 공용이므로 **기존 줄을 고치지 말고 추가만** 한다.

브랜치: `feat/farmer-app`. `main`에 직접 커밋 금지.

---

## 1. 스택 (이미 정해져 있음 — 바꾸지 말 것)

```
React 18.3.1 + Vite 5.4.8 + react-router-dom 6.26.2
순수 JSX  — TypeScript 아님. .tsx 파일 만들지 말 것
순수 CSS  — Tailwind 없음. className은 styles.css에 있는 클래스만 사용
FastAPI + SQLAlchemy 2 + SQLite (backend/)
```

- **Tailwind, shadcn, styled-components, CSS Modules 설치 금지.** `package.json`에 의존성 추가하지 말 것.
- 인라인 `style={{}}`은 위치·크기 지정에만 최소로. 색·폰트·라운드는 반드시 CSS 변수/클래스로.
- 아이콘은 `shared/Icon.jsx`(line SVG)와 `shared/Fruit.jsx`(과일 스프라이트)를 쓴다. 새 아이콘이 필요하면 `Icon.jsx`의 `PATHS`에 추가.

실행:
```bash
# 터미널 1
cd backend && uvicorn app.main:app --reload --port 8000
# 터미널 2
cd frontend && npm run dev     # http://localhost:5173
```

---

## 2. 디자인 시스템 — `frontend/src/styles.css`가 유일한 기준

파스텔 그라데이션 무대 + 글래스모피즘. 자영업자 앱이 이 톤으로 완성되어 있으므로 **농가 앱도 똑같이 간다.**

> ⚠️ 이 톤은 **임시 스킨**이다. 통합 완료 후 별도 디자인 레퍼런스로 전체를 다시 통일할 예정이므로,
> 작성 시 반드시 7장 "리디자인 대비 규칙"을 함께 지킬 것.

### 색 (CSS 변수만 사용. HEX 하드코딩 절대 금지)
```
--ink #1D2A24   --muted #6F7D76   --faint #A8B4AE
--green #2E9C6A --green-d #1E7B50 --mint #DDF2E7 --mint-2 #C9EAD9
--peach #FCE3D2 --orange #F2913A  --red #E0574F
--glass rgba(255,255,255,.72)     --glass-strong rgba(255,255,255,.9)
--glass-line rgba(255,255,255,.95)
--shadow / --shadow-lg
```

### 반드시 재사용할 기존 클래스
| 용도 | 클래스 |
|---|---|
| 카드 | `glass pad` |
| 제목/보조 텍스트 | `t1` / `t2` |
| 섹션 헤더 | `sec` > `h3` + `span` |
| 버튼 | `btn` `btn block` `btn lg` `btn soft` `btn white` `btn sm` |
| 뱃지 | `pill` `pill or` `pill gray` `st` `st ok` `off` |
| 가로 칩 | `chips` > `button[aria-pressed]` |
| 세그먼트 | `seg` |
| 2열 선택 카드 | `opt` > `button[aria-pressed]` |
| 수량 스테퍼 | `stepper` |
| 진행바 | `progress-card` > `.bar` > `i` |
| 그린 강조 카드 | `hero-green` |
| 타임라인 | `tl` > `li.done/.now` > `.dot` `.lb` `.sub` `.when` |
| 금액 행 | `line` `line save` `line total` |
| 빈 상태 | `empty` |
| 숫자 | `num` (tabular-nums) |
| 하단 네비 | `nav` > `nav-item` |

### 포맷 유틸 (`shared/format.js`)
`won(n)` 금액 콤마 · `timeLabel(iso)` 상대 시각 · `DAYS` 요일 배열. 직접 구현하지 말고 이걸 쓴다.

### 금지
- 새 색상값/폰트/라운드 임의 생성 (변수에 없으면 물어볼 것)
- `styles.css` 기존 줄 수정 (추가는 파일 맨 끝 `/* ───── farmer ───── */` 블록에만)
- 자영업자 앱과 다른 톤의 컴포넌트 (다크 카드, 각진 보더, 다른 폰트 등)

---

## 3. 농가 앱 폴더 구조

```
frontend/src/farmer/
  FarmerApp.jsx          ← Stage + 폰 프레임 셸 (StoreApp.jsx 구조를 그대로 따름)
  FarmerContext.jsx      ← 농가 선택, 요청 목록, API 호출, 액션
  utils.js               ← 파생값 계산 (won은 shared/format.js 것 사용)
  mock.js                ← 백엔드에 없는 로컬 데이터 (시세, 정산, 로트)
  components/
    FarmerNav.jsx        ← 하단 4탭
  pages/
    Pick.jsx             ← 농가 선택 (자영업자의 Welcome에 대응)
    Home.jsx             ← 홈 대시보드
    LotNew.jsx           ← 출하 등록 3스텝
    Orders.jsx           ← 출하 요청 관리  ★시연 핵심
    Settlement.jsx       ← 정산
```

라우트: `/farmer`, `/farmer/pick`, `/farmer/lot/new`, `/farmer/orders`, `/farmer/settlement`.

---

## 4. 데이터 — 무엇을 API로, 무엇을 로컬로

백엔드에 **Lot(출하 로트) 개념이 없다.** 있는 것은 `Farm`, `FarmSupply`, `ShipmentRequest`뿐.

| 화면 | 데이터 출처 |
|---|---|
| 농가 선택 | `GET /api/farmer/farms` ✅ API |
| 홈 — 수요 예측 | `GET /api/farmer/demand` ✅ API |
| 홈 — 공급 현황 | `farms[].supplies` ✅ API |
| 홈 — 시세 비교 | 로컬 상수 (백엔드에 없음) |
| **요청 관리** | `GET /api/farmer/farms/{id}/requests` + `PATCH /api/farmer/requests/{id}` ✅ **실연동 필수** |
| 출하 등록 | 로컬 state + `PATCH /api/farmer/supplies/{id}`로 출하 가능량만 반영 |
| 정산 | 로컬 상수 |

### ShipmentRequest 상태값 (models.py 확인됨)
```
requested → accepted → shipped
```
자영업자 주문 단계와 연동됨: 모든 요청이 `accepted`면 주문 step 2, 모두 `shipped`면 step 3으로 자동 진행.
**이 연쇄가 시연의 하이라이트다.**

### 주의
- `ShipmentRequest`에는 가게 이름이 없고 `store_id`, `order_code`만 있다.
  가게 이름이 필요하면 `GET /api/stores`를 한 번 불러 id→name 맵을 만든다.
- API 호출은 `frontend/src/api.js`의 `request()` 헬퍼를 재사용하고, `farmerApi`를 **추가**한다 (기존 `api` 객체 수정 금지).

---

## 5. 시연 동선 (여기에 맞춰 우선순위를 둔다)

```
① / 역할 선택  →  ② /store 주문 생성  →  ③ 역할 전환
→ ④ /farmer/orders 요청 수락  →  ⑤ /store/orders 단계가 실제로 올라감
```

⑤가 성립하면 "두 앱이 하나의 플랫폼"이 증명된다. 다른 어떤 화면보다 우선한다.

**모든 수치는 데모용 가상 데이터다** (`backend/app/seed.py`). 발표 자료에 실제 데이터라고 쓰지 말 것.

---

## 6. 작업 규칙

- 한 번에 한 화면씩. 여러 화면 동시 생성 금지.
- 작업 후 `cd frontend && npm run build` 통과 확인.
- 폰 화면 폭은 400px(`.phone`) 기준. 가로 스크롤 생기면 안 됨.
- 설명은 짧게. 코드 외 장황한 요약 금지.

---

## 7. 리디자인 대비 규칙 (필수)

통합 완료 후 **별도 디자인 레퍼런스로 전체 톤을 다시 통일할 예정**이다.
지금 쓰는 글래스모피즘 톤은 영구적이지 않다. 그때 비용을 최소화하기 위해 아래를 반드시 지킨다.

**① 색·그림자·라운드는 CSS 변수만 참조한다.**
HEX를 하드코딩하면 리디자인 때 파일마다 수동으로 찾아 고쳐야 한다.
```jsx
// ❌ style={{ background: '#2E9C6A' }}
// ✅ style={{ background: 'var(--green)' }}
```

**② 농가 전용 요소에는 `farmer-` 접두 클래스를 하나 더 붙인다.**
팀 클래스는 "현재 스킨", `farmer-*`는 "구조 식별자"로 취급한다.
리디자인 때 `farmer-*`만 잡고 다시 칠하면 되게 한다.
```jsx
// ❌ <div className="glass pad progress-card">
// ✅ <div className="farmer-lot glass pad progress-card">
```
붙일 이름 예: `farmer-lot` `farmer-request` `farmer-price` `farmer-demand`
`farmer-settle` `farmer-step` `farmer-pick`
→ `styles.css`의 `/* ───── farmer ───── */` 블록에 빈 셀렉터로라도 선언해 둘 것.

**③ 로직과 마크업을 분리한다.**
API 호출·상태 계산·파생값은 `FarmerContext.jsx`와 `utils.js`에 모은다.
`pages/*.jsx`는 마크업과 이벤트 핸들러만 담당해서, 리디자인 때 페이지 파일만 다시 써도 되게 한다.

**④ 리디자인 작업 범위는 아래로 제한한다 (나중에 작업할 때 참고).**

| 건드림 ✅ | 안 건드림 ❌ |
|---|---|
| `:root` CSS 변수값 | 클래스 이름 · DOM 구조 |
| 폰트 패밀리 | 컴포넌트 분리 방식 |
| `--shadow` · 라운드 수치 | 로직 · API 호출 |
| `.glass` 배경 투명도 | 라우팅 |

구조까지 손대기 시작하면 빌드가 깨진 채로 마감을 맞는다.

---

## 8. 보류 중인 기능 (의논해서 뺀 것들 — 같은 논의 반복 방지)

| 기능 | 보류 이유 |
|---|---|
| 주문 상세 `/farmer/orders/:id` | 시연 동선에 없음. 목록에서 바로 수락/출고 가능 |
| 단골 바이어 관리 | 백엔드에 `isRepeat` 개념 없음 |
| 출하 사진 AI 등급 추천 | 목업만. 실제 추론 없음 |
| 출하 로트(Lot) DB 저장 | 백엔드 모델 없음. 추가 시 마이그레이션 필요 |
| 포장중·집하완료 상태 | `ShipmentRequest.status`에 존재하지 않음 (3단계뿐) |

새로 빼기로 한 기능이 생기면 이 표에 한 줄 추가한다.
