import { PRICES, SKIPPED_STEPS } from './mock.js'

// 공급 현황 파생값
export const reservedKg = (s) => Math.max(0, s.weekly_capacity_kg - s.available_kg)
export const sellThrough = (s) => (s.weekly_capacity_kg ? reservedKg(s) / s.weekly_capacity_kg : 0)

// 농가의 주력 품목 = 주간 생산량이 가장 큰 공급
export const mainSupply = (farm) =>
  farm?.supplies?.length
    ? farm.supplies.reduce((a, b) => (b.weekly_capacity_kg > a.weekly_capacity_kg ? b : a))
    : null

// 시세 비교 — 품목 id로 로컬 상수를 찾는다
export const priceOf = (fruitId) => PRICES[fruitId] ?? null
export const priceGap = (p) => p.platform - p.auction
export const priceGapPercent = (p) => Math.round((priceGap(p) / p.auction) * 100)
export { SKIPPED_STEPS }

// 출하 요청
export const REQUEST_TABS = [
  { status: 'requested', label: '요청' },
  { status: 'accepted', label: '수락' },
  { status: 'shipped', label: '출고완료' },
]

export const countByStatus = (requests, status) =>
  (requests ?? []).filter((r) => r.status === status).length

export const STATUS_LABEL = {
  requested: '수락 대기',
  accepted: '수락됨',
  shipped: '출고 완료',
}

// 자영업자 주문 단계는 그 주문의 모든 농가가 같은 상태가 되어야 올라간다(routers/farmer.py).
// 한 주문이 여러 농가로 쪼개진 경우 내가 수락해도 단계가 그대로이므로, 그때는 다르게 안내한다.
const NEEDED_STEP = { accepted: 2, shipped: 3 }

export const stepMessage = (status, orderStep) => {
  const did = status === 'accepted' ? '수락했어요' : '출고 처리했어요'
  if (orderStep >= NEEDED_STEP[status]) return `${did} · 자영업자 주문이 ${orderStep}단계로 올라갔어요`
  const waiting = status === 'accepted' ? '수락' : '출고'
  return `${did} · 같은 주문의 다른 농가 ${waiting}을 기다려요`
}

export const harvestLabel = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}
