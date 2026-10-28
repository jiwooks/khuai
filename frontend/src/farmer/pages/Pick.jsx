import { useNavigate } from 'react-router-dom'

import { FruitIcon } from '../../shared/Fruit.jsx'
import { useFarmer } from '../FarmerContext.jsx'
import { mainSupply } from '../utils.js'

export default function Pick() {
  const { farms, setFarmId } = useFarmer()
  const navigate = useNavigate()

  if (!farms) return <div className="empty">불러오는 중…</div>

  const choose = (id) => {
    setFarmId(id)
    navigate('/farmer', { replace: true })
  }

  return (
    <div className="farmer-pick">
      <div className="head-bar"><h2>어느 농가로 보시겠어요?</h2></div>
      <p className="t2" style={{ margin: '0 2px 14px' }}>
        선택한 농가로 들어온 출하 요청을 보여드려요.
      </p>

      {farms.map((f) => {
        const main = mainSupply(f)
        return (
          <button key={f.id} className="store-opt" onClick={() => choose(f.id)}>
            <span className="im">{main && <FruitIcon id={main.fruit_id} />}</span>
            <span className="grow">
              <span className="t1" style={{ display: 'block' }}>{f.name}</span>
              <span className="t2" style={{ display: 'block' }}>
                {f.region} · 평점 {f.rating} · {f.supplies.length}품목
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
