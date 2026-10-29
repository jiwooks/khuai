import { useSearchParams } from 'react-router-dom'

import { api } from '../../api.js'
import { FruitIcon, FruitTile } from '../../shared/Fruit.jsx'
import Character from '../../shared/Character.jsx'
import { DAYS, short, won } from '../../shared/format.js'
import ForecastBars from '../components/ForecastBars.jsx'
import Stepper from '../components/Stepper.jsx'
import { useLoad, useStore } from '../StoreContext.jsx'

const TABS = [['rec', '상품 추천'], ['sub', '정기 발주'], ['menu', '메뉴 제안']]

export default function AI() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'rec'
  return (
    <>
      <div className="head-bar"><h2>AI 도우미</h2></div>
      <div className="seg">
        {TABS.map(([id, label]) => (
          <button key={id} aria-pressed={tab === id} onClick={() => setParams({ tab: id }, { replace: true })}>{label}</button>
        ))}
      </div>
      {tab === 'rec' && <Recommend />}
      {tab === 'sub' && <Subscriptions />}
      {tab === 'menu' && <MenuIdeas />}
    </>
  )
}

function Recommend() {
  const { storeId, fruits, addToCart, toast, version, refresh } = useStore()
  const { data } = useLoad(() => Promise.all([api.forecast(storeId), api.subscriptions(storeId)]), [storeId, version])
  if (!data) return <div className="empty">예측하는 중…</div>
  const [recs, subs] = data
  const subscribed = new Set(subs.items.map((s) => s.fruit_id))
  const subscribe = async (r) => {
    try {
      await api.createSubscription(storeId, { fruit_id: r.fruit_id, boxes: r.boxes, days: [2, 5] })
      toast(`${fruits[r.fruit_id].name} 매주 화·금 정기 발주 등록`)
      refresh()
    } catch (e) { toast(e.message) }
  }
  return (
    <>
      <p className="t2" style={{ margin: '0 2px 12px' }}>최근 8주 주문 이력과 품목별 출하 시즌으로 다음 주 사용량을 예측했어요.</p>
      <div className="stack">
        {recs.map((r) => {
          const f = fruits[r.fruit_id]
          if (!f) return null
          return (
            <div className="fcard glass" key={r.fruit_id}>
              <div className="hd">
                <FruitTile fruit={f} />
                <div className="grow"><div className="t1">{f.name}</div><div className="t2">{f.farm} · {f.season_label}</div></div>
                <span className="ai-tag">AI 예측</span>
              </div>
              <div className="bars"><ForecastBars history={r.history} forecast={r.forecast_kg} high={r.high_kg} /></div>
              <div className="why">
                최근 4주 평균 <b className="num">{r.last4_avg_kg}kg</b> 대비{' '}
                <b className={r.change_pct >= 0 ? 'up' : 'dn'}>{r.change_pct >= 0 ? '+' : ''}{r.change_pct}%</b>{' '}
                (예측 범위 {r.low_kg}~{r.high_kg}kg). {r.reason.split('. ').slice(1).join('. ')}
              </div>
              <div className="row" style={{ marginTop: 12, gap: 8 }}>
                <button className="btn sm" onClick={() => { addToCart(f.id, r.boxes); toast(`${f.name} ${r.boxes}박스 담았어요`) }}>{r.boxes}박스 담기</button>
                <button className="btn sm soft" disabled={subscribed.has(f.id)} onClick={() => subscribe(r)}>
                  {subscribed.has(f.id) ? '정기 발주 중' : '매주 정기 발주'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function Subscriptions() {
  const { storeId, version, refresh, toast } = useStore()
  const { data } = useLoad(() => api.subscriptions(storeId), [storeId, version])
  if (!data) return <div className="empty">불러오는 중…</div>
  const update = async (id, body) => { try { await api.updateSubscription(id, body); refresh() } catch (e) { toast(e.message) } }
  const remove = async (id) => { await api.deleteSubscription(id); toast('정기 발주를 해지했어요'); refresh() }
  const toggleDay = (s, d) => {
    const days = s.days.includes(d) ? s.days.filter((x) => x !== d) : [...s.days, d]
    if (days.length) update(s.id, { days })
  }
  return (
    <>
      <div className="hero-green">
        <small>정기 발주로 농가에 약속된 판로</small>
        <b className="num">월 {won(data.monthly_kg)}kg</b>
        <small>농가는 이 물량에 맞춰 미리 수확·출하 계획을 세워요.</small>
      </div>
      <div className="sec"><h3>정기 발주 목록</h3><span>요일을 눌러 바꿔요</span></div>
      <div className="stack">
        {data.items.length === 0 && <div className="empty">아직 정기 발주가 없어요.<br />‘발주 추천’에서 매주 쓰는 과일을 등록해 보세요.</div>}
        {data.items.map((s) => (
          <div className="glass pad" key={s.id}>
            <div className="row">
              <FruitTile fruit={s} />
              <div className="grow"><div className="t1">{s.name}</div><div className="t2">회당 {s.unit_kg}kg × {s.boxes} · 월 {s.monthly_kg}kg</div></div>
              <Stepper value={s.boxes} min={1} onChange={(n) => update(s.id, { boxes: n })} />
            </div>
            <div className="days">
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <button key={d} aria-pressed={s.days.includes(d)} onClick={() => toggleDay(s, d)}>{DAYS[d]}</button>
              ))}
              <button className="t2" style={{ marginLeft: 'auto', fontWeight: 700, width: 'auto', background: 'none' }} onClick={() => remove(s.id)}>해지</button>
            </div>
          </div>
        ))}
      </div>
      <Character type="merchant" className="subscription-art" />
    </>
  )
}

function MenuIdeas() {
  const { storeId, store, fruits, addToCart, toast } = useStore()
  const { data } = useLoad(() => api.menuIdeas(storeId), [storeId])
  if (!data) return <div className="empty">메뉴를 고르는 중…</div>
  return (
    <>
      <p className="t2" style={{ margin: '0 2px 12px' }}>
        이번 주 입고 과일 가격과 <b style={{ color: 'var(--ink)' }}>{store?.type}</b> 업종을 바탕으로 원가까지 계산한 메뉴예요.
      </p>
      <div className="stack">
        {data.map((m) => (
          <div className="glass pad menu-card" key={m.name}>
            <div className="row">
              <span className="im">
                <FruitIcon id={m.fruit_ids[0]} />
                {m.fruit_ids[1] && <span className="f2"><FruitIcon id={m.fruit_ids[1]} /></span>}
              </span>
              <div className="grow">
                <span className="ai-tag">AI 추천 메뉴</span>
                <div className="t1" style={{ marginTop: 4 }}>{m.name}</div>
                <div className="t2">{m.note}</div>
              </div>
            </div>
            <div className="econ">
              <div><small>제안 판매가</small><b className="num">{won(m.price)}원</b></div>
              <div><small>1개 원가</small><b className="num">{won(m.cost)}원</b></div>
              <div><small>마진율</small><b className="num up">{m.margin_pct}%</b></div>
            </div>
            <div className="why">{m.reason} 1개당 과일 원가 <b className="num">{won(m.saving_per_unit)}원</b> 절감.</div>
            <div className="row" style={{ marginTop: 12, gap: 8 }}>
              {m.fruit_ids.map((id) => fruits[id] && (
                <button key={id} className="btn sm soft" onClick={() => { addToCart(id); toast(`${fruits[id].name} 1박스 담았어요`) }}>
                  {short(fruits[id].name)} 담기
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
