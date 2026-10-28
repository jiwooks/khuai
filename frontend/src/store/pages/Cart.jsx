import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../api.js'
import { FruitIcon, FruitTile } from '../../shared/Fruit.jsx'
import Icon from '../../shared/Icon.jsx'
import { won } from '../../shared/format.js'
import Stepper from '../components/Stepper.jsx'
import { useStore } from '../StoreContext.jsx'

const FREE_SHIPPING = 100000
const SHIPPING_FEE = 4000

export default function Cart() {
  const { storeId, cart, setCart, setQty, fruits, toast, refresh } = useStore()
  const [slot, setSlot] = useState('am')
  const [pay, setPay] = useState('month')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const ids = Object.keys(cart).filter((id) => fruits[id])

  if (!ids.length) {
    return (
      <>
        <div className="head-bar"><h2>장바구니</h2></div>
        <div className="empty">
          <div style={{ width: 120, height: 110, margin: '0 auto 14px' }}><FruitIcon id="basket" /></div>
          담긴 과일이 없어요.<br /><br />
          <Link className="btn" to="/store/market">마켓 둘러보기</Link>
        </div>
      </>
    )
  }

  let total = 0, market = 0, kg = 0
  ids.forEach((id) => { const f = fruits[id], k = f.unit_kg * cart[id]; total += f.price * k; market += f.market_price * k; kg += k })
  const ship = total >= FREE_SHIPPING ? 0 : SHIPPING_FEE

  const checkout = async () => {
    setBusy(true)
    try {
      const order = await api.createOrder(storeId, { items: ids.map((id) => ({ fruit_id: id, boxes: cart[id] })), slot, pay_method: pay })
      setCart({})
      refresh()
      toast('주문했어요. AI가 농가를 매칭했어요')
      nav(`/store/orders?open=${order.code}`)
    } catch (e) { toast(e.message) } finally { setBusy(false) }
  }

  return (
    <>
      <div className="head-bar"><h2>장바구니</h2><span className="sub num">{ids.length}개 품목</span></div>
      <div className="stack">
        {ids.map((id) => {
          const f = fruits[id]
          return (
            <div className="citem glass" key={id}>
              <FruitTile fruit={f} size={62} pad={8} radius={16} />
              <div className="grow">
                <div className="t1">{f.name}</div>
                <div className="t2">{f.farm} · {f.unit_kg}kg 박스</div>
                <b className="num" style={{ color: 'var(--green)' }}>{won(f.price * f.unit_kg * cart[id])}원</b>
              </div>
              <Stepper value={cart[id]} onChange={(n) => setQty(id, n)} />
            </div>
          )
        })}
      </div>

      <div className="sec"><h3>도착 시간</h3></div>
      <div className="opt">
        <button aria-pressed={slot === 'am'} onClick={() => setSlot('am')}><b>내일 오전</b>06:00–10:00 · 오픈 전</button>
        <button aria-pressed={slot === 'pm'} onClick={() => setSlot('pm')}><b>내일 오후</b>13:00–17:00</button>
      </div>
      <div className="sec"><h3>결제 방법</h3></div>
      <div className="opt">
        <button aria-pressed={pay === 'month'} onClick={() => setPay('month')}><b>월말 정산</b>사업자 후불 결제</button>
        <button aria-pressed={pay === 'card'} onClick={() => setPay('card')}><b>카드 결제</b>법인·개인 카드</button>
      </div>

      <div className="glass pad" style={{ marginTop: 16 }}>
        <div className="line"><span>상품 금액 ({kg}kg)</span><span className="num">{won(total)}원</span></div>
        <div className="line"><span>배송비</span><span className="num">{ship ? `${won(ship)}원` : '무료'}</span></div>
        <div className="line save"><span>도매시장 경유 대비 절감</span><span className="num">−{won(market - total)}원</span></div>
        <div className="line total"><span>결제 금액</span><span className="num">{won(total + ship)}원</span></div>
      </div>
      <button className="btn block lg" style={{ marginTop: 16 }} onClick={checkout} disabled={busy}>
        {busy ? '주문 중…' : '주문하기'} <span className="arr"><Icon name="arrow" /></span>
      </button>
    </>
  )
}
