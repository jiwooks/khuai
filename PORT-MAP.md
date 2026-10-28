# 이식 대응표 — 내 Tailwind 농가 UI → 팀 `styles.css`

`_ref/khu ai/src/`(기존 작업물)를 `frontend/src/farmer/`로 옮길 때 쓰는 1:1 대응표.
**로직과 화면 구성은 그대로 살리고, 색·클래스·데이터 출처만 바꾼다.**

> ⚠️ 팀 톤(글래스모피즘)은 **임시 스킨**이다. 통합 후 레퍼런스로 다시 통일할 예정이므로
> `CLAUDE.md` 7장(리디자인 대비 규칙)을 반드시 함께 지킬 것 — 특히 `farmer-` 접두 클래스.

---

## 0. 모든 요소에 붙이는 접두 클래스

구조 식별자를 하나씩 더 붙인다. 팀 클래스는 나중에 통째로 교체될 수 있다.

```jsx
<div className="farmer-price hero-green">        {/* 시세 카드 */}
<div className="farmer-lot glass pad">           {/* 출하 로트 카드 */}
<div className="farmer-request glass pad">       {/* 출하 요청 카드 */}
<div className="farmer-demand mini glass">       {/* 수요 예측 타일 */}
<div className="farmer-settle glass pad">        {/* 정산 카드 */}
<div className="farmer-step">                    {/* 출하 등록 스텝 래퍼 */}
<div className="farmer-pick">                    {/* 농가 선택 */}
```

`styles.css` 끝의 `/* ───── farmer ───── */` 블록에 빈 셀렉터로라도 선언해 둔다.
리디자인 때 이 셀렉터들만 잡고 다시 칠하면 된다.

---

## 1. 색 토큰 대응

| 기존 (tailwind.config.js) | 팀 CSS 변수 | 비고 |
|---|---|---|
| `brand` `#0F3D2C` | `var(--green-d)` `#1E7B50` | 딥그린 → 조금 밝아짐 |
| `brandText` `#1F6B4A` | `var(--green-d)` | |
| `brandSoft` `#EAF3EE` | `var(--mint)` `#DDF2E7` | |
| `pop` `#2BB673` | `var(--green)` `#2E9C6A` | |
| `alert` `#E0503A` | `var(--red)` `#E0574F` | |
| `alertSoft` `#FDEEEA` | `var(--peach)` `#FCE3D2` | 주황 계열로 바뀜 |
| `ink` `#1A1A18` | `var(--ink)` `#1D2A24` | |
| `inkSub` `#55524C` | `var(--muted)` | `inkSub`/`inkMuted` 둘 다 `--muted`로 통합 |
| `inkMuted` `#8B877F` | `var(--muted)` `#6F7D76` | |
| `inkFaint` `#B6B2AA` | `var(--faint)` `#A8B4AE` | |
| `surface` `#FFFFFF` | `var(--glass)` | 카드는 글래스로 |
| `line` `#E8E6E1` | `var(--glass-line)` | |
| `bg` `#FAFAF8` | 없음 — `.device` 배경 그라데이션 상속 | **배경 지정하지 말 것** |

> **HEX를 코드에 쓰지 말 것.** 반드시 `var(--...)` 형태로 참조한다.
> 리디자인 때 `:root` 한 블록만 바꿔서 전체 톤이 따라오게 하는 것이 목적이다.

> 가장 큰 변화: 배경이 **단색 → 파스텔 그라데이션**, 카드가 **흰 박스 → 반투명 글래스**다.
> 카드에 `background:#fff`를 주면 자영업자 앱과 톤이 어긋난다.

---

## 2. 클래스 대응

| 기존 Tailwind | 팀 클래스 (+ `farmer-` 접두) |
|---|---|
| `bg-surface border border-line rounded-2xl p-4` | `farmer-xxx glass pad` |
| `text-base font-700` | `t1` |
| `text-cap text-inkMuted` / `text-sm text-inkMuted` | `t2` |
| 섹션 라벨 행 (`SectionLabel`) | `<div className="sec"><h3>제목</h3><span>보조</span></div>` |
| `bg-brand text-white h-[52px] rounded-xl w-full` | `btn block lg` |
| `bg-brandSoft text-brandText rounded-md px-3 py-2` | `btn soft sm` |
| `bg-surface border-line` 보조 버튼 | `btn white` |
| `bg-brandSoft text-brandText` 칩 | `pill` |
| `bg-alertSoft text-alert` 칩 | `pill or` |
| 회색 칩 | `pill gray` |
| 주문 상태 뱃지 | `st` (진행) / `st ok` (완료) |
| 가로 스크롤 선택 칩 | `chips` > `button[aria-pressed]` |
| `SelectChip` 2열 그리드 | `opt` > `button[aria-pressed]` (체크 표시 자동) |
| L/2L/3L 세그먼트 | `seg` (3칸 고정 grid) |
| `Stepper` 컴포넌트 | `stepper` > `button` + `span` |
| `ProgressBar` | `<div className="progress-card"><div className="bar"><i style={{width:'20%'}}/></div></div>` |
| 딥그린 시세 카드 | `farmer-price hero-green` ← **그린 그라데이션 카드. 거의 완벽 대응** |
| 빈 상태 한 줄 | `empty` |
| 주문 단계 타임라인 | `tl` > `li.done/.now` |
| 금액 합계 행 | `line` / `line save` / `line total` |
| 하단 탭바 | `nav n4` > `NavLink` > `span.nav-item` |

### 버리는 것
| 기존 파일 | 이유 |
|---|---|
| `components/layout/PhoneFrame.tsx` | `.phone`/`.device`/`.status`/`.screen` CSS가 이미 있음 |
| `components/layout/TabBar.tsx` | `BottomNav.jsx` 구조를 복사해 `FarmerNav.jsx`로 |
| `components/ui/*` 전부 | 팀 클래스로 대체. 별도 컴포넌트 불필요 |
| `tailwind.config.js` `postcss.config.js` `tsconfig*.json` | 스택 다름 |
| `index.css` | `styles.css`로 대체 |
| `mock/selectors.ts`의 `won()` | `shared/format.js`의 `won()` 사용 |

### 살리는 것
| 기존 파일 | 이식 위치 |
|---|---|
| `screens/Home.tsx` (195줄) | `farmer/pages/Home.jsx` |
| `screens/LotNew.tsx` (365줄) | `farmer/pages/LotNew.jsx` |
| `screens/Orders.tsx` (153줄) | `farmer/pages/Orders.jsx` ★API 연동 |
| `screens/Settlement.tsx` (77줄) | `farmer/pages/Settlement.jsx` |
| `mock/store.tsx` (Context) | `farmer/FarmerContext.jsx` (API 호출로 교체) |
| `mock/selectors.ts` 파생값 | `farmer/utils.js` (`won`은 제외) |
| `mock/lots.ts` `prices.ts` `settlement.ts` | `farmer/mock.js` (로컬 유지분만) |

---

## 3. 데이터 모델 대응

### Order → ShipmentRequest

| 기존 `Order` 필드 | 백엔드 응답 | 처리 |
|---|---|---|
| `id` | `id` (number) | |
| `lotId` | 없음 | 로컬 lot과 품목명으로 느슨하게 연결 |
| `buyerName` `"카페 가온"` | 없음 — `store_id`만 | `GET /api/stores`로 id→name 맵 생성 |
| `buyerType` `"카페"` | 없음 | 매장 응답에 종류가 있으면 사용, 없으면 생략 |
| `buyerRegion` | 없음 | 생략 |
| `qtyKg` | `kg` | |
| `unitPrice` | 없음 | 로컬 품목 단가 사용 (`farmer/mock.js`) |
| `status: pending` | `status: "requested"` | **이름 변경** |
| `status: accepted` | `"accepted"` | 그대로 |
| `status: packing/collected/delivered` | `"shipped"` 하나로 통합 | **탭 5개 → 3개로 축소** |
| `requestedDate` | 없음 | 생략하거나 `created_at` 기준 +2일 표시 |
| `createdAt` | `created_at` (ISO) | `timeLabel()` 사용 |
| `isRepeat` | 없음 | 생략 |
| — | `fruit` (품목명) | 신규. 카드에 표시 |
| — | `order_code` | 신규. 주문번호로 표시하면 신뢰감 ↑ |

### 탭 구조 변경
```
기존: 신규 / 수락 / 포장중 / 집하완료 / 완료   (5탭)
변경: 요청 / 수락 / 출고완료                   (3탭)
      requested  accepted  shipped
```

### 액션 변경
```js
// 기존 (로컬 state)
acceptOrder(orderId)  // status='accepted', lot.reservedKg += qtyKg

// 변경 (실 API)
await farmerApi.updateRequest(id, { status: 'accepted' })
// → 응답 { id, status, order_step }
// → 목록 새로고침, 자영업자 주문 단계도 자동으로 올라감
```

출고 버튼 추가: `{ status: 'shipped' }` — 이게 자영업자 주문을 step 3으로 올린다.

### Lot — 백엔드에 없음
`Lot`(수확예정일·당도·등급·totalKg·reservedKg)은 **로컬 state로 유지**한다.
단, 출하 등록 완료 시 `PATCH /api/farmer/supplies/{id}`로 `available_kg`를 올려서
"백엔드에도 반영된다"는 느낌을 만든다. (선택 — 시간 남으면)

---

## 4. API 추가분 (`frontend/src/api.js` 맨 아래에 **추가만**)

```js
export const farmerApi = {
  farms: () => request('/farmer/farms'),
  requests: (farmId) => request(`/farmer/farms/${farmId}/requests`),
  updateRequest: (id, body) => request(`/farmer/requests/${id}`, { method: 'PATCH', body }),
  updateSupply: (id, body) => request(`/farmer/supplies/${id}`, { method: 'PATCH', body }),
  demand: () => request('/farmer/demand'),
}
```

`request()`는 이미 파일 안에 있으므로 재사용한다. 기존 `api` 객체는 건드리지 않는다.
