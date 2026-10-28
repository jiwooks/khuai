import { NavLink } from 'react-router-dom'

import Icon from '../../shared/Icon.jsx'

const Item = ({ to, icon, label, end }) => (
  <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'on' : '')}>
    {({ isActive }) => (
      <span className="nav-item" aria-current={isActive ? 'page' : undefined}>
        <Icon name={icon} width={1.8} size={22} />{label}
      </span>
    )}
  </NavLink>
)

export default function FarmerNav() {
  return (
    <nav className="nav n4" aria-label="농가 앱 메뉴">
      <Item to="/farmer" end icon="home" label="홈" />
      <Item to="/farmer/lot/new" icon="market" label="출하등록" />
      <Item to="/farmer/orders" icon="orders" label="요청" />
      <Item to="/farmer/settlement" icon="ai" label="정산" />
    </nav>
  )
}
