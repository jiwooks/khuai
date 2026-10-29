import { NavLink } from 'react-router-dom'
import Icon from '../../shared/Icon.jsx'
import { useStore } from '../StoreContext.jsx'

const Item = ({ to, icon, label, end }) => (
  <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'on' : '')}>
    {({ isActive }) => (
      <span className="nav-item" aria-current={isActive ? 'page' : undefined}>
        <Icon name={icon} width={1.8} size={26} active={isActive} />{label}
      </span>
    )}
  </NavLink>
)

export default function BottomNav() {
  const { cartCount } = useStore()
  return (
    <nav className="nav" aria-label="앱 메뉴">
      <Item to="/store" end icon="home" label="홈" />
      <Item to="/store/market" icon="market" label="마켓" />
      <NavLink to="/store/cart" className="center" aria-label="장바구니">
        {({ isActive }) => <>
          <span className="fab"><Icon name="cart" size={26} active={isActive} /></span>
          <span className={`cart-label ${isActive ? 'on' : ''}`}>장바구니</span>
          {cartCount > 0 && <span className="badge num">{cartCount}</span>}
        </>}
      </NavLink>
      <Item to="/store/orders" icon="orders" label="주문" />
      <Item to="/store/ai" icon="ai" label="AI" />
    </nav>
  )
}
