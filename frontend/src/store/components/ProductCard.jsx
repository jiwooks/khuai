import { FruitIcon } from '../../shared/Fruit.jsx'
import { won } from '../../shared/format.js'
import { useStore } from '../StoreContext.jsx'

export default function ProductCard({ f }) {
  const { cart, addToCart, setSheet, toast } = useStore()
  const q = cart[f.id] || 0
  return (
    <div className="pcard glass">
      <button onClick={() => setSheet({ type: 'product', id: f.id })} style={{ textAlign: 'left', display: 'block' }}>
        <div className="im fr-bg" style={{ background: f.tint }}>
          <span className="off">-{f.discount_pct}%</span>
          {f.ugly && <span className="pill or gr">B급</span>}
          <FruitIcon id={f.id} />
        </div>
        <div className="nm">{f.name}</div>
        <div className="fm">{f.region} · 수확 {f.harvested_hours}시간 전</div>
      </button>
      <div className="bt">
        <div>
          <b className="num" style={{ fontSize: 14, fontWeight: 800 }}>{won(f.price)}원</b>
          <small>kg · <s className="num">{won(f.market_price)}</s></small>
        </div>
        {q > 0 && <span className="qty-tag num">{q}박스</span>}
        <button className="plus" aria-label={`${f.name} 담기`} onClick={() => { addToCart(f.id); toast(`${f.name} 1박스 담았어요`) }}>+</button>
      </div>
    </div>
  )
}
