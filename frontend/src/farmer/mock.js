// 백엔드에 없는 로컬 데이터. 모두 데모용 가상 수치이며 실제 시세·정산액이 아니다.
// 품목 id는 /api/fruits 의 id와 맞춘다 (apple pear shine persim tang kiwi fig yuzu uapple utang).

// 시세 비교 — 백엔드에 시세 API가 없다. 품목별 경매가/정산가 (원/kg).
export const PRICES = {
  apple: { auction: 3100, platform: 4600, grade: '특' },
  pear: { auction: 2700, platform: 4100, grade: '특' },
  shine: { auction: 6400, platform: 9200, grade: '상' },
  persim: { auction: 1800, platform: 2900, grade: '특' },
  tang: { auction: 2200, platform: 3400, grade: '상' },
  kiwi: { auction: 4000, platform: 5800, grade: '특' },
  fig: { auction: 7100, platform: 10400, grade: '상' },
  yuzu: { auction: 2500, platform: 3800, grade: '상' },
  uapple: { auction: 1400, platform: 2300, grade: 'B급' },
  utang: { auction: 1100, platform: 1800, grade: 'B급' },
}

// 건너뛴 중간 유통 단계 수 (도매법인 → 중도매인 → 소매상)
export const SKIPPED_STEPS = 3

// 출하 등록 — 품목별 품종
export const VARIETIES = {
  apple: ['홍로', '후지', '감홍'],
  pear: ['신고', '원황', '화산'],
  shine: ['샤인머스캣'],
  persim: ['부유', '차랑', '태추'],
  tang: ['조생', '한라봉', '천혜향'],
  kiwi: ['골드키위', '그린키위', '레드키위'],
  fig: ['승정도후인', '바나네'],
  yuzu: ['유자'],
  uapple: ['홍로', '후지'],
  utang: ['조생', '한라봉'],
}

export const GRADES = ['L', '2L', '3L']
export const QTY_PRESETS = [50, 100, 200, 300]
export const HARVEST_DATE = '2026-11-02'

// 정산 — 백엔드에 정산 모델이 없다.
export const SETTLEMENT = {
  month: 11,
  payoutDay: 25,
  expected: 1240000,
  feeRate: 0.08,
}

// 기존 유통 구조에서 농가에 돌아가던 비율. 데모용 가상 수치로 실제 통계가 아니다.
export const LEGACY_FARMER_SHARE = 0.43

export const PAST_SETTLEMENTS = [
  { month: 10, amount: 2180000 },
  { month: 9, amount: 1760000 },
  { month: 8, amount: 940000 },
]
