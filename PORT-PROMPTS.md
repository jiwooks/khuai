# 이식 프롬프트 세트 (Claude Code 복붙용)

순서대로 **하나씩**. 각 단계 후 브라우저에서 눈으로 확인하고 다음으로.
**전체를 한 번에 붙여넣지 말 것** — 품질이 무너진다.

## 전체 일정

| 시점 | 작업 |
|---|---|
| 10/28 밤 | P0 세팅 → **P1** → **P3** ← 시연 동선부터 뚫기 |
| 10/29 오전 | P2 → P4 |
| 10/29 오후 | P5 → 점검 → **커밋·푸시·PR** ← 안전지대 확보 |
| 10/29 밤 ~ | P6 리디자인 (`feat/redesign` 새 브랜치) |
| 10/30 오전 | 서식3·4·5 작성 ← 절대 미루지 말 것 |

마감: **10/30(금) 17:00**

---

## P0 · 세팅 (터미널에서 직접, 10분)

```bash
# 1) 팀 리포 클론
git clone https://github.com/jiwooks/khuai
cd khuai
git checkout -b feat/farmer-app

# 2) 키트 파일 배치
#    CLAUDE.md       → khuai/CLAUDE.md        (리포 루트. Claude Code가 자동으로 읽음)
#    PORT-MAP.md     → khuai/PORT-MAP.md
#    PORT-PROMPTS.md → khuai/PORT-PROMPTS.md
#    기존 작업물 'khu ai' 폴더 → khuai/_ref/khu ai/   (참고용)

echo "_ref/" >> .gitignore

# 3) 백엔드 (터미널 1)
cd backend
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 4) 프론트 (터미널 2)
cd frontend
npm install
npm run dev
```

확인: http://localhost:5173/store 가 뜨고, http://localhost:8000/docs 에 `/api/farmer/*` 5개가 보이면 OK.
그다음 VS Code에서 `khuai` 폴더를 열고 Claude Code 실행.

---

## P1 · 역할 선택 화면 + 농가 앱 셸

```
PORT-MAP.md를 먼저 읽어줘. (CLAUDE.md는 이미 읽혔을 것)

지금 할 일: 역할 선택 진입 화면과 농가 앱 껍데기를 만든다. 화면 내용은 아직 채우지 마.
frontend/src/store/ 안의 파일은 절대 수정하지 말 것.
CLAUDE.md 7장 리디자인 대비 규칙(CSS 변수만, farmer- 접두 클래스, 로직 분리)을 전 단계에서 지킬 것.

1. frontend/src/styles.css 맨 끝에 아래 블록을 그대로 추가 (기존 줄은 손대지 말 것)

/* ───────── farmer ───────── */
/* 리디자인 시 아래 farmer-* 셀렉터만 잡고 다시 칠한다 */
.farmer-price{} .farmer-lot{} .farmer-request{} .farmer-demand{}
.farmer-settle{} .farmer-step{} .farmer-pick{}

.rolepick{padding:34px 4px 20px}
.rolepick h2{font-size:29px;line-height:1.22;font-weight:800;letter-spacing:-.03em;color:var(--green-d);margin-bottom:8px}
.rolepick>p{color:var(--muted);margin:0 0 22px;font-size:13.5px}
.role-card{display:flex;align-items:center;gap:14px;padding:16px;border-radius:24px;text-decoration:none;color:inherit;margin-bottom:12px;
  background:var(--glass);border:1px solid var(--glass-line);backdrop-filter:blur(12px);box-shadow:var(--shadow)}
.role-card .im{width:62px;height:62px;border-radius:20px;background:#fff;display:grid;place-items:center;padding:11px;flex:none}
.role-card b{display:block;font-size:16.5px;font-weight:800;letter-spacing:-.02em}
.role-card small{display:block;font-size:11.5px;color:var(--muted);margin-top:3px;line-height:1.45}
.role-card .go{width:30px;height:30px;border-radius:50%;background:var(--mint);color:var(--green-d);display:grid;place-items:center;flex:none;margin-left:auto}
.roleswitch{position:fixed;top:14px;right:14px;z-index:30;display:flex;gap:3px;background:var(--glass-strong);
  border:1px solid var(--glass-line);border-radius:999px;padding:4px;box-shadow:var(--shadow);backdrop-filter:blur(10px)}
.roleswitch a{padding:7px 14px;border-radius:999px;font-size:12px;font-weight:700;color:var(--muted);text-decoration:none}
.roleswitch a.on{background:var(--green);color:#fff}
.nav.n4{grid-template-columns:repeat(4,1fr)}

2. frontend/src/RolePicker.jsx 신규
   - StoreApp.jsx의 Stage 구조를 그대로 따른다 (.stage > aside.side.left + .phone > .device + aside.side)
   - 왼쪽 aside: 기존 StoreApp의 로고·h1·.flow 유통단계 목록을 그대로 재사용
   - 폰 안: StatusBar 컴포넌트 재사용, .screen 안에 <div className="rolepick">
       h2 "과일잇다에\n오신 것을 환영해요"
       p  "어느 쪽으로 시작할까요?"
       Link to="/farmer" className="role-card"
         .im 안에 <FruitIcon id="basket" />, b "생산자(농가)",
         small "출하 요청을 받고 수락해요. 경매 없이 제값에 팝니다."
         .go 안에 <Icon name="arrow" />
       Link to="/store" className="role-card"
         .im 안에 <FruitIcon id="apple" />, b "자영업자",
         small "필요한 과일을 AI 추천으로 발주해요."
         .go 안에 <Icon name="arrow" />
   - 오른쪽 aside: .feat 카드 하나로 "두 앱이 ShipmentRequest로 연결됩니다" 설명 3줄

3. frontend/src/RoleSwitch.jsx 신규
   - <nav className="roleswitch"> 안에 NavLink 2개: "농가"→/farmer, "자영업자"→/store
   - 활성 시 className "on"
   - 경로가 "/"일 때는 null 반환 (역할 선택 화면에선 숨김)

4. frontend/src/main.jsx 수정 — 라우트만 바꾼다
   - "/" 를 Navigate 대신 <RolePicker /> 로
   - <RoleSwitch /> 를 <Routes> 바깥, BrowserRouter 안쪽에 렌더
   - /store/* 와 /farmer/* 는 그대로 유지

5. frontend/src/farmer/ 구조 생성
   - FarmerApp.jsx : StoreApp.jsx와 동일한 Stage+Phone 구조.
     왼쪽 aside는 농가 관점 문구("도매시장 경매 없이, 받은 요청만 보면 됩니다")
     Routes: index→Home, "pick"→Pick, "lot/new"→LotNew, "orders"→Orders, "settlement"→Settlement
     farmId 없으면 /farmer/pick 으로 Navigate (StoreApp의 storeId 패턴 그대로)
     pick 화면에선 하단 네비 숨김
   - FarmerContext.jsx : farmId, setFarmId, farms, requests, storeNames, reload, toast 를 담은 Context.
     지금은 상태 구조만 만들고 API 호출 본문은 비워둘 것.
   - utils.js : 파생값 계산 함수 자리 (won은 shared/format.js 것 사용)
   - mock.js : 백엔드에 없는 로컬 데이터 자리 (시세, 정산, 로트)
   - components/FarmerNav.jsx : BottomNav.jsx를 복사해 4탭으로.
     className="nav n4", FAB 없음.
     홈(home) / 출하등록(market 아이콘 재사용) / 요청(orders) / 정산(ai)
   - pages/ 5개 파일은 화면명만 한 줄 띄우는 placeholder로

6. frontend/src/api.js 맨 아래에 farmerApi 추가 (PORT-MAP.md 4장 코드 그대로).
   기존 api 객체는 수정하지 말 것.

확인 기준: / 에서 역할 선택이 뜨고, 두 카드가 각각 /farmer, /store 로 가고,
우상단 전환 버튼이 동작하고, npm run build 통과.
마지막에 git diff --stat 을 보여줘 (store/ 가 수정됐는지 확인용).
```

---

## P3 · 요청 관리 ★ 시연 핵심 — P2보다 먼저 한다

> P2(홈)보다 이걸 먼저 하는 이유: 이 화면 하나가 "두 앱이 하나의 플랫폼"을 증명한다.
> 홈이 예쁜 것보다 이 연쇄가 도는 게 훨씬 중요하다.

```
_ref/khu ai/src/screens/Orders.tsx 를 읽고 frontend/src/farmer/pages/Orders.jsx 로 이식하되,
mock 대신 실제 API를 쓴다. PORT-MAP.md의 대응표를 적용하고, Tailwind className은 하나도 남기지 말 것.
카드 루트에는 farmer-request 접두 클래스를 붙이고, 색은 var(--...) 로만 쓸 것.

데이터 (FarmerContext.jsx 안에 모을 것. 페이지에서 직접 fetch 하지 말 것):
- GET /api/farmer/farms/{farmId}/requests
- GET /api/stores 를 한 번 불러 store_id → 가게명 맵 생성 후 캐시

탭 3개 (기존 5탭에서 축소):
  요청 {n} / 수락 {n} / 출고완료 {n}   ← requested / accepted / shipped
  store/pages/Orders.jsx 의 .seg 또는 .chips 패턴을 그대로 사용

요청 카드 (className="farmer-request glass pad"):
- 상단행: .pill "{fruit}" + .st 또는 .st ok 상태 뱃지 / 우측 .t2 timeLabel(created_at)
- .t1 "{가게명}" / .t2 "주문번호 {order_code}"
- 구분선 후: .t1 "{kg}kg" 우측 정렬
- 하단 버튼 (상태별):
    requested → [수락하기] btn block        → PATCH { status: 'accepted' }
    accepted  → [출고 완료] btn block soft  → PATCH { status: 'shipped' }
    shipped   → 버튼 없음, .st ok "출고 완료"

액션 후:
- farmerApi.updateRequest(id, {status}) 호출
- 응답의 order_step 을 토스트로 표시:
  "수락했어요 · 자영업자 주문이 {n}단계로 이동했어요"
  (.toast 클래스와 StoreContext의 토스트 패턴 참고)
- 목록 reload

빈 탭: .empty "해당하는 요청이 없어요" 한 줄. 일러스트 금지.

★ 반드시 확인: 수락 후 다른 탭(/store/orders)에서 주문 단계가 실제로 올라가는지.
이게 안 되면 이 화면은 완성이 아니다.
```

---

## P2 · 농가 선택 + 홈 대시보드

```
_ref/khu ai/src/screens/Home.tsx 를 읽고 frontend/src/farmer/pages/Home.jsx 로 이식한다.
PORT-MAP.md의 색·클래스 대응표를 적용하고, Tailwind className은 하나도 남기지 말 것.
각 카드 루트에 farmer-* 접두 클래스를 붙이고, 색은 var(--...) 로만 쓸 것.

먼저 pages/Pick.jsx:
- className="farmer-pick"
- GET /api/farmer/farms 로 농가 목록을 받아 .store-opt 스타일 버튼 리스트로 표시
  (store/components/Sheets.jsx 의 매장 선택 UI를 참고)
- 각 항목: 농가명, region, rating, 공급 품목 수
- 선택하면 FarmerContext의 farmId 설정 후 /farmer 로 이동

그다음 pages/Home.jsx — 위에서 아래로:

① 상단 인사 (.top)
   .avatar 에 농가 이니셜, h2 "{농가명}님", .t2 "{region} · 오늘 할 일 N건"

② 할 일 카드 — requested 상태 요청이 있을 때만
   className="glass pad", 왼쪽에 .pill or "요청 N건",
   .t1 "새 출하 요청이 왔어요", 오른쪽 Icon arrow
   클릭 시 /farmer/orders

③ 시세 비교 카드 ★ 핵심 — className="farmer-price hero-green"
   small "오늘 설향 딸기 2L 기준"
   b "3,400원/kg"  (.num)
   그 아래 작은 행: "가락시장 경매가 2,100원" 취소선 + "+62%"
   하단 한 줄: "중간 유통 3단계를 건너뛰어 kg당 1,300원이 더 남았어요"
   ※ 이 수치는 farmer/mock.js 의 로컬 상수. 백엔드에 시세 API 없음.

④ .sec "내 출하 현황" + span "{supplies.length}개 품목"
   farms[].supplies 를 map:
   className="farmer-lot glass pad progress-card"
   .t1 "{fruit} {weekly_capacity_kg}kg" / 우측 .pill "가용 {available_kg}kg"
   .bar > i width = (capacity-available)/capacity * 100%
   .t2 하단 "예약 {capacity-available}kg · 잔여 {available}kg"

⑤ .sec "다음 주 예상 수요" + .ai-tag "AI 예측"
   GET /api/farmer/demand 결과 상위 3개를 .mini2 그리드로
   각 className="farmer-demand mini glass": small 품목명, b "{forecast_kg}kg"

⑥ 정산 카드 className="farmer-settle glass pad" (좌우 배치)
   좌: .t2 "11월 정산 예정액" / b "1,240,000원" (.num)
   우: .btn soft sm "내역"  → /farmer/settlement

제약:
- 금액은 shared/format.js 의 won() 사용
- 로딩 중에는 .empty 로 "불러오는 중" 한 줄
- 카드 배경에 #fff 하드코딩 금지. glass 사용
- API 호출은 FarmerContext에, 파생값 계산은 utils.js에
```

---

## P4 · 출하 등록 3스텝

```
_ref/khu ai/src/screens/LotNew.tsx (365줄)를 frontend/src/farmer/pages/LotNew.jsx 로 이식.
3스텝 구조와 입력 흐름은 그대로 살리고, 클래스만 팀 것으로 바꾼다.
스텝 래퍼에 farmer-step 접두 클래스를 붙일 것.

대응:
- 진행바 3칸 → .progress-card .bar 를 3개 나란히, 완료 칸만 i width 100%
- 품목 선택 2열 그리드 → .opt > button[aria-pressed]  (체크 표시 자동으로 붙음)
- 품종 가로 칩 → .chips > button[aria-pressed]
- L/2L/3L → .seg
- 당도 스테퍼 → .stepper  (슬라이더 쓰지 말 것)
- 수량 프리셋 → .chips, 직접 입력은 .search input 패턴
- 하단 고정 버튼 → .btn block lg, 비활성은 disabled 속성 (.btn[disabled] 스타일 있음)
- 요약 카드 → .farmer-price hero-green 또는 .glass pad + .line total

사진 등록 영역:
- 점선 박스 대신 .glass pad 안에 Icon + "수확 사진 등록" + .t2 "사진을 올리면 등급을 추천해 드려요"
- .ai-tag 를 붙여 AI 기능임을 표시
- 실제 업로드 불필요. 클릭하면 더미 썸네일 3개가 채워지는 척만.

제출 시:
- FarmerContext의 로컬 lots 배열에 추가 (백엔드에 Lot 모델 없음)
- 가능하면 PATCH /api/farmer/supplies/{id} 로 available_kg 도 올림 (시간 없으면 생략)
- 토스트 "출하 등록 완료" 후 /farmer 로 이동
```

---

## P5 · 정산 (시간 남을 때만)

```
_ref/khu ai/src/screens/Settlement.tsx 를 frontend/src/farmer/pages/Settlement.jsx 로 이식.
전부 farmer/mock.js 의 로컬 상수. API 없음. 루트에 farmer-settle 접두 클래스.

- 상단: .farmer-price hero-green, small "11월 정산 예정액", b "1,240,000원",
  하단 "11월 25일 입금 예정"
- 수수료 공개 카드 (.farmer-settle glass pad):
  제목 .t1 "수수료는 이렇게 쓰여요"
  가로 스택바: 농가 92% (var(--green)) / 플랫폼 8% (var(--mint-2))
  .t2 "기존 유통 구조에서는 소비자가 낸 금액의 43%만 농가에 돌아갔어요"
  ※ 43%는 데모용 가상 수치. 코드에 주석으로 남길 것
- 월별 내역 3행: .line 패턴 (10월/9월/8월, 날짜+금액)
```

---

## 점검 (P5 직후, 커밋 전)

```
전체를 점검해줘:
1. frontend/src/store/ 안의 파일이 하나라도 수정됐는지 git diff 로 확인 (있으면 되돌릴 것)
2. frontend/src/farmer/ 에 Tailwind className이 남아 있는지 검색 (bg- text- rounded- px- py- flex- gap- 등)
3. farmer/ 안에 HEX 색상값(#으로 시작하는 6자리)이 하드코딩된 곳 검색 → var(--...) 로 교체
4. farmer/pages/ 의 카드·섹션 루트에 farmer-* 접두 클래스가 빠진 곳 확인
5. styles.css 기존 줄이 수정됐는지 확인. /* farmer */ 블록 외 변경이 있으면 되돌릴 것
6. package.json 에 새 의존성이 추가됐는지 확인 (있으면 제거)
7. 400px 폭에서 가로 스크롤 생기는 화면 확인
8. cd frontend && npm run build 통과
9. 시연 동선: / → /store 주문 → 전환 → /farmer/orders 수락 → /store/orders 단계 상승

고친 내용만 표로 간단히 보고해줘.
```

---

## 커밋 & 푸시 ← 여기가 안전지대. 리디자인 전에 반드시 통과할 것

```bash
git add -A
git commit -m "feat: 생산자(농가) 앱 구현 + 역할 선택 진입 화면"
git push -u origin feat/farmer-app
# GitHub에서 PR 생성 → 팀원 확인 후 main 머지
```

**이걸 끝내기 전에는 리디자인을 시작하지 않는다.** 망해도 돌아갈 데를 먼저 만든다.

---

## P6 · 리디자인 (새 브랜치에서)

```bash
git checkout -b feat/redesign
```

```
디자인 레퍼런스를 반영해 전체 톤을 통일한다.
아래 범위만 건드린다. 벗어나는 변경은 하지 말고 먼저 물어볼 것.

건드림 ✅
- frontend/src/styles.css 의 :root CSS 변수값 (색, 그림자, 폰트)
- --font 폰트 패밀리와 index.html 의 웹폰트 링크
- .glass / .glass-strong 의 배경 투명도와 blur 값
- border-radius 수치
- .farmer-* 셀렉터 (농가 전용 요소 재스타일링)

안 건드림 ❌
- 클래스 이름, DOM 구조, 컴포넌트 분리 방식
- 로직, API 호출, 라우팅
- frontend/src/store/ 안의 JSX 파일

작업 순서:
1. 먼저 :root 변수값만 레퍼런스 색으로 바꾸고 양쪽 앱을 둘러본다
2. 그 상태에서 어긋나는 부분만 .farmer-* 로 보정한다
3. 각 단계마다 npm run build 와 /store, /farmer 양쪽 육안 확인

매 단계 후 git diff --stat 을 보여줘. store/ 의 JSX가 바뀌면 즉시 되돌릴 것.
```

문제 생기면 즉시 롤백:
```bash
git checkout feat/farmer-app
```
