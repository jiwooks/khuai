import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../api.js'
import { FruitIcon } from '../../shared/Fruit.jsx'
import Icon from '../../shared/Icon.jsx'
import Character from '../../shared/Character.jsx'
import { won } from '../../shared/format.js'
import { useLoad, useStore } from '../StoreContext.jsx'

export function SearchBar({ initial = '', style }) {
  const [q, setQ] = useState(initial)
  const nav = useNavigate()
  return (
    <form className="search" style={style} onSubmit={(e) => { e.preventDefault(); nav(`/store/market?q=${encodeURIComponent(q.trim())}`) }}>
      <input id="search-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="과일, 산지, 농가 검색" />
      <button className="go" aria-label="검색"><Icon name="search" /></button>
    </form>
  )
}

export default function Home() {
  const { storeId, store, fruits, addToCart, toast, setSheet, version } = useStore()
  const { data, error } = useLoad(() => api.home(storeId), [storeId, version])
  if (error) return <div className="empty">{error}</div>
  if (!data || !store) return <div className="empty">불러오는 중…</div>
  const C = 2 * Math.PI * 34
  const a = data.active_order
  return (
    <>
      <div className="top">
        <div className="grow">
          <h2>안녕하세요,<br />{store.name} 사장님!</h2>
          <div className="t2">{store.location} · <b>내일 오전 도착</b> 가능</div>
        </div>
        <button className="avatar" onClick={() => setSheet({ type: 'store' })} aria-label="매장 바꾸기"><Character type="merchant" /></button>
      </div>
      <SearchBar />
      <div className="banner">
        <h3>제철 과일, 산지에서<br />바로 최대 {data.max_discount_pct}% 저렴하게</h3>
        <p>오후 2시 전 주문하면<br />내일 오전 10시 전 매장 도착</p>
        <Link className="btn sm" to="/store/market">마켓 보기</Link>
        <div className="art">
          <Character type="merchant" />
        </div>
      </div>

      <div className="sec"><h3>AI 발주 추천</h3><Link to="/store/ai">전체 보기</Link></div>
      <div className="rec-scroll">
        {data.recommendations.map((r) => {
          const f = fruits[r.fruit_id]
          if (!f) return null
          return (
            <div className="rcard glass" key={r.fruit_id}>
              <button onClick={() => setSheet({ type: 'product', id: f.id })} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
                <div className="im fr-bg" style={{ background: f.tint, padding: '8px 22px' }}><FruitIcon id={f.id} /></div>
                <div className="t1" style={{ fontSize: 13 }}>{f.name}</div>
                <div className="kg">다음 주 <b className="num">{r.forecast_kg}kg</b></div>
              </button>
              <div className="bx">
                <b className="num">{r.boxes}박스</b>
                <button className="plus" aria-label={`${f.name} 추천 수량 담기`} onClick={() => { addToCart(f.id, r.boxes); toast(`${f.name} ${r.boxes}박스 담았어요`) }}><Icon name="plus" /></button>
              </div>
            </div>
          )
        })}
      </div>

      {a && (
        <>
          <div className="sec"><h3>진행 중인 주문</h3><Link to={`/store/orders?open=${a.code}`}>자세히</Link></div>
          <Link className="glass pad progress-card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }} to={`/store/orders?open=${a.code}`}>
            <div className="row">
              <div className="grow"><div className="t1">{a.step_label}</div><div className="t2">{a.items.map((i) => i.name).join(', ')}</div></div>
              <b className="num" style={{ color: 'var(--green)' }}>{a.step + 1}/6</b>
            </div>
            <div className="bar"><i style={{ width: `${((a.step + 1) / 6) * 100}%` }} /></div>
          </Link>
        </>
      )}

      <div className="sec"><h3>과일잇다로 아낀 돈</h3><span>도매시장 경유가 대비</span></div>
      <div className="glass pad ring-card">
        <div className="ring">
          <svg viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="34" fill="none" stroke="var(--mint)" strokeWidth="10" />
            <circle cx="42" cy="42" r="34" fill="none" stroke="var(--green)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${C * data.saving_rate} ${C}`} transform="rotate(-90 42 42)" />
          </svg>
          <b className="num">{Math.round(data.saving_rate * 100)}%</b>
        </div>
        <div className="grow">
          <div className="t2">누적 절감액</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 800 }}>{won(data.saved)}원</div>
          <div className="t2">정기 발주 {data.subscription_count}건 진행 중</div>
        </div>
      </div>
    </>
  )
}
