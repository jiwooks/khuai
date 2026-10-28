import { Link } from 'react-router-dom'

import Icon from '../../shared/Icon.jsx'
import { won } from '../../shared/format.js'
import { SETTLEMENT } from '../mock.js'
import { useFarmer } from '../FarmerContext.jsx'
import {
  SKIPPED_STEPS,
  countByStatus,
  mainSupply,
  priceGap,
  priceGapPercent,
  priceOf,
  reservedKg,
  sellThrough,
} from '../utils.js'

export default function Home() {
  const { farm, requests, demand, fruitNames } = useFarmer()

  if (!farm) return <div className="empty">불러오는 중…</div>

  const pending = countByStatus(requests, 'requested')
  const main = mainSupply(farm)
  const price = main && priceOf(main.fruit_id)
  const top = (demand ?? []).slice(0, 3)

  return (
    <>
      <div className="top">
        <span className="avatar">{farm.name.slice(0, 1)}</span>
        <div className="grow">
          <h2>{farm.name}님</h2>
          <div className="t2">
            {farm.region} · 오늘 할 일 <b>{pending}건</b>
          </div>
        </div>
      </div>

      {pending > 0 && (
        <Link to="/farmer/orders" className="glass pad row" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="pill or">요청 {pending}건</span>
          <div className="grow">
            <div className="t1">새 출하 요청이 왔어요</div>
          </div>
          <Icon name="arrow" size={18} />
        </Link>
      )}

      {price && (
        <div className="farmer-price hero-green" style={{ marginTop: 14 }}>
          <small>오늘 {main.fruit} {price.grade} 기준</small>
          <b className="num">{won(price.platform)}원/kg</b>
          <div className="row" style={{ gap: 8, marginTop: 2 }}>
            <s className="num" style={{ opacity: 0.85, fontSize: 12 }}>
              가락시장 경매가 {won(price.auction)}원
            </s>
            <span className="num" style={{ fontWeight: 800, fontSize: 12 }}>
              +{priceGapPercent(price)}%
            </span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.28)', marginTop: 12, paddingTop: 10 }}>
            <small>
              중간 유통 {SKIPPED_STEPS}단계를 건너뛰어 kg당 {won(priceGap(price))}원이 더 남았어요
            </small>
          </div>
        </div>
      )}

      <div className="sec">
        <h3>내 출하 현황</h3>
        <span>{farm.supplies.length}개 품목</span>
      </div>
      <div className="stack">
        {farm.supplies.map((s) => (
          <div className="farmer-lot glass pad progress-card" key={s.id}>
            <div className="row">
              <div className="grow">
                <div className="t1 num">{s.fruit} {s.weekly_capacity_kg}kg</div>
              </div>
              <span className="pill num">가용 {s.available_kg}kg</span>
            </div>
            <div className="bar">
              <i style={{ width: `${Math.round(sellThrough(s) * 100)}%` }} />
            </div>
            <div className="t2 num" style={{ marginTop: 8 }}>
              예약 {Math.round(reservedKg(s))}kg · 잔여 {s.available_kg}kg
            </div>
          </div>
        ))}
      </div>

      <div className="sec">
        <h3>다음 주 예상 수요</h3>
        <span className="ai-tag">AI 예측</span>
      </div>
      {top.length === 0 ? (
        <div className="empty">예측을 불러오는 중…</div>
      ) : (
        <div className="mini2">
          {top.map((d) => (
            <div className="farmer-demand mini glass" key={d.fruit_id}>
              <small>{fruitNames[d.fruit_id] ?? d.fruit_id}</small>
              <b className="num">{d.forecast_kg}kg</b>
            </div>
          ))}
        </div>
      )}

      <div className="sec">
        <h3>정산</h3>
      </div>
      <div className="farmer-settle glass pad row">
        <div className="grow">
          <div className="t2">{SETTLEMENT.month}월 정산 예정액</div>
          <b className="num" style={{ fontSize: 20, fontWeight: 800 }}>{won(SETTLEMENT.expected)}원</b>
        </div>
        <Link to="/farmer/settlement" className="btn soft sm">내역</Link>
      </div>
    </>
  )
}
