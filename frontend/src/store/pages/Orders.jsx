import { useSearchParams } from 'react-router-dom'

import { api } from '../../api.js'
import { FruitTile } from '../../shared/Fruit.jsx'
import { timeLabel, won } from '../../shared/format.js'
import { useLoad, useStore } from '../StoreContext.jsx'

export default function Orders() {
  const { storeId, version, refresh, addToCart, toast, setSheet } = useStore()
  const [params, setParams] = useSearchParams()
  const { data } = useLoad(() => api.orders(storeId), [storeId, version])

  if (!data) return <div className="empty">불러오는 중…</div>
  if (!data.length) return <><div className="head-bar"><h2>주문 내역</h2></div><div className="empty">아직 주문이 없어요.</div></>
  const openCode = data.some((o) => o.code === params.get('open')) ? params.get('open') : data[0].code

  const advance = async (code) => { await api.advanceOrder(code); refresh() }
  const reorder = (o) => { o.items.forEach((i) => addToCart(i.fruit_id, i.boxes)); toast('지난 주문 구성을 담았어요') }

  return (
    <>
      <div className="head-bar"><h2>주문 내역</h2></div>
      <div className="stack">
        {data.map((o) => {
          const open = o.code === openCode
          const done = o.step === 5
          return (
            <div className="glass pad" key={o.code}>
              <button style={{ width: '100%', textAlign: 'left', display: 'block' }} onClick={() => setParams({ open: o.code }, { replace: true })}>
                <div className="row">
                  <div style={{ display: 'flex' }}>
                    {o.items.slice(0, 3).map((i, k) => (
                      <FruitTile key={i.fruit_id} fruit={i} size={40} pad={5} round style={{ border: '2px solid #fff', marginLeft: k ? -12 : 0 }} />
                    ))}
                  </div>
                  <div className="grow">
                    <div className="t1 num">{o.code}</div>
                    <div className="t2">{o.items.map((i) => `${i.name} ${i.boxes}`).join(' · ')}</div>
                  </div>
                  <span className={`st ${done ? 'ok' : ''}`}>{o.step_label}</span>
                </div>
              </button>
              {open && (
                <>
                  {o.step >= 1 && o.items.filter((i) => i.farm).map((i) => (
                    <div className="match" key={i.fruit_id}>
                      <span className="sc num">{i.match_score}</span>
                      <div className="grow">
                        <div className="t1" style={{ fontSize: 13 }}>{i.name} → {i.farm.name}</div>
                        <div className="t2">AI 매칭 · {i.farm.region} {i.farm.distance_km}km · 평점 {i.farm.rating}</div>
                      </div>
                    </div>
                  ))}
                  <ol className="tl">
                    {o.timeline.map((t) => (
                      <li key={t.label} className={`${t.done ? 'done' : ''} ${t.current ? 'now' : ''}`}>
                        <span className="dot">{t.done ? '✓' : ''}</span>
                        <div><div className="lb">{t.label}</div><div className="sub">{t.desc}</div></div>
                        <span className="when num">{timeLabel(t.at)}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span className="t2">결제 금액 (절감 {won(o.saving)}원)</span><b className="num">{won(o.total + o.shipping_fee)}원</b>
                  </div>
                  {!done ? (
                    <button className="btn sm soft" style={{ marginTop: 12 }} onClick={() => advance(o.code)}>다음 단계로 진행 (데모)</button>
                  ) : (
                    <div className="row" style={{ marginTop: 12, gap: 8 }}>
                      <button className="btn sm" onClick={() => reorder(o)}>다시 담기</button>
                      <button className="btn sm soft" disabled={o.reviewed} onClick={() => setSheet({ type: 'review', code: o.code })}>
                        {o.reviewed ? '평가 완료' : '품질 평가'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
