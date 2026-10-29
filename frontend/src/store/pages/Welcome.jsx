import { FruitIcon } from '../../shared/Fruit.jsx'
import Character from '../../shared/Character.jsx'
import Icon from '../../shared/Icon.jsx'
import { useStore } from '../StoreContext.jsx'

export default function Welcome() {
  const { setSheet } = useStore()
  return (
    <div className="welcome">
      <span className="leafbtn"><FruitIcon id="leaf" /></span>
      <h2>산지 과일,<br />우리 가게로 바로</h2>
      <p>영세 농가와 자영업자를 AI가 직접 이어 드려요. 경매·중도매 없이 더 신선하고 합리적으로.</p>
      <span className="welcome-apple"><FruitIcon id="apple" /></span>
      <div>
        <button className="btn lg" onClick={() => setSheet({ type: 'store' })}>
          시작하기 <span className="arr"><Icon name="arrow" /></span>
        </button>
      </div>
      <div className="basket"><Character type="welcome" decorative={false} /></div>
      <span className="welcome-orange"><FruitIcon id="tang" /></span>
      <div className="trust">
        <span className="trust-icons" style={{ display: 'flex' }}>
          {['apple', 'tang', 'kiwi'].map((id, i) => (
            <span key={id} style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', padding: 3, marginLeft: i ? -8 : 0, border: '1.5px solid var(--mint)' }}><FruitIcon id={id} /></span>
          ))}
        </span>
        <span>전국 <b>16개</b> 농가 · <b>4개</b> 데모 매장</span>
      </div>
    </div>
  )
}
