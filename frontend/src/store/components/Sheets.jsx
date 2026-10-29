import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../../api.js'
import { FruitIcon } from '../../shared/Fruit.jsx'
import Icon from '../../shared/Icon.jsx'
import { won } from '../../shared/format.js'
import { useStore } from '../StoreContext.jsx'
import Stepper from './Stepper.jsx'

function Sheet({ onClose, children, label }) {
  const dialog = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    const panel = dialog.current
    panel.querySelector('button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if (e.key !== 'Tab') return
      const controls = [...panel.querySelectorAll('button:not(:disabled), input, a[href], [tabindex="0"]')].filter((el) => el.getClientRects().length)
      const first = controls[0], last = controls.at(-1)
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
    panel.addEventListener('keydown', onKey)
    return () => { panel.removeEventListener('keydown', onKey); previous?.focus() }
  }, [onClose])
  return (
    <div className="sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} ref={dialog}>
        <div className="grab" />
        <button className="close-sheet" onClick={onClose} aria-label="상세 창 닫기">← 닫기</button>
        {children}
      </div>
    </div>
  )
}

export default function Sheets() {
  const { sheet, setSheet } = useStore()
  if (!sheet) return null
  const close = () => setSheet(null)
  return (
    <Sheet onClose={close} label={{ product: '과일 상세', store: '매장 선택', review: '품질 평가' }[sheet.type]}>
      {sheet.type === 'product' && <ProductSheet id={sheet.id} close={close} />}
      {sheet.type === 'store' && <StoreSheet close={close} />}
      {sheet.type === 'review' && <ReviewSheet code={sheet.code} close={close} />}
    </Sheet>
  )
}

function ProductSheet({ id, close }) {
  const { cart, setQty, toast, setSheet } = useStore()
  const [f, setF] = useState(null)
  const [qty, setQ] = useState(cart[id] || 1)
  useEffect(() => { setF(null); setQ(cart[id] || 1); api.fruit(id).then(setF) }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!f) return <div className="empty">불러오는 중…</div>
  return (
    <>
      <div className="detail-im fr-bg" style={{ background: f.tint }}>
        <FruitIcon id={f.id} /><span className="heart"><Icon name="heart" /></span>
      </div>
      <div className="row">
        <div className="grow"><h3 style={{ margin: 0 }}>{f.name}</h3><div className="t2">{f.farm} · {f.region}</div></div>
        <span className="t2">★ <b style={{ color: 'var(--ink)' }}>{f.rating}</b> (거래 {f.deals}회)</span>
      </div>
      <div className="price" style={{ marginTop: 8 }}>
        <b className="num" style={{ fontSize: 22 }}>{won(f.price)}원</b><span className="t2">/kg</span>
        <s className="num">{won(f.market_price)}원</s><span className="off">-{f.discount_pct}%</span>
      </div>
      <div className="facts">
        <div><small>수확</small><b>{f.harvested_hours}시간 전</b></div>
        <div><small>등급</small><b>{f.grade} · {f.season_label}</b></div>
        <div><small>포장</small><b>{f.unit_kg}kg 박스</b></div>
      </div>
      <div className="t2" style={{ marginBottom: 6 }}>AI 농가 매칭 후보</div>
      {f.candidates.map((c, i) => (
        <div className="match" key={c.farm_id} style={{ background: i ? '#fff' : 'var(--mint)' }}>
          <span className="sc num" style={{ background: '#fff' }}>{c.score}</span>
          <div className="grow">
            <div className="t1" style={{ fontSize: 13 }}>{c.farm} {i === 0 && <span className="pill">1순위</span>}</div>
            <div className="t2">{c.distance_km}km · 평점 {c.rating} · 출하 가능 {won(c.available_kg)}kg</div>
          </div>
        </div>
      ))}
      <div className="row" style={{ margin: '16px 0 18px', gap: 12 }}>
        <Stepper value={qty} min={1} onChange={setQ} soft />
        <button className="btn grow" onClick={() => { setQty(id, qty); close(); toast(`${f.name} ${qty}박스 담았어요`) }}>
          장바구니 담기 · <span className="num">{won(f.price * f.unit_kg * qty)}</span>원
        </button>
      </div>
      <div className="t1" style={{ marginBottom: 8 }}>함께 많이 담는 과일</div>
      <div className="also">
        {f.also.map((x) => (
          <button key={x.id} onClick={() => setSheet({ type: 'product', id: x.id })}>
            <div className="im"><FruitIcon id={x.id} /></div><b>{x.name}</b><small className="num">{won(x.price)}원/kg</small>
          </button>
        ))}
      </div>
    </>
  )
}

function StoreSheet({ close }) {
  const { storeId, setStoreId, toast } = useStore()
  const [stores, setStores] = useState([])
  const nav = useNavigate()
  useEffect(() => { api.stores().then(setStores) }, [])
  return (
    <>
      <h3>매장 선택 (데모)</h3>
      {stores.map((s) => (
        <button key={s.id} className="store-opt" aria-pressed={storeId === s.id}
          onClick={() => { setStoreId(s.id); close(); toast(`${s.name}(으)로 전환했어요`); nav('/store') }}>
          <span className="avatar" style={{ width: 40, height: 40, fontSize: 15 }}>{s.icon}</span>
          <span className="grow"><b>{s.name}</b><br /><span className="t2">{s.type} · {s.location}</span></span>
        </button>
      ))}
    </>
  )
}

function ReviewSheet({ code, close }) {
  const { toast, refresh } = useStore()
  const [score, setScore] = useState({ taste: 4, freshness: 4, size: 4 })
  const rows = [['taste', '당도·맛'], ['freshness', '신선도'], ['size', '크기·선별']]
  const submit = async () => {
    try {
      await api.reviewOrder(code, score)
      toast('평가를 농가에 전달했어요')
      refresh()
      close()
    } catch (e) { toast(e.message) }
  }
  return (
    <>
      <h3>품질 평가</h3>
      <p className="t2" style={{ marginTop: -6 }}>평가는 농가 평점에 반영되고, 다음 AI 농가 매칭 점수에 쓰여요.</p>
      {rows.map(([k, label]) => (
        <div key={k} className="row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
          <span className="t1" style={{ fontSize: 13.5 }}>{label}</span>
          <div className="days" style={{ margin: 0 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-pressed={n <= score[k]} onClick={() => setScore({ ...score, [k]: n })}>{n}</button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn block" style={{ marginTop: 14 }} onClick={submit}>평가 보내기</button>
    </>
  )
}
