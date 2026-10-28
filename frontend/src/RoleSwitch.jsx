import { NavLink, useLocation } from 'react-router-dom'

export default function RoleSwitch() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  const cls = ({ isActive }) => (isActive ? 'on' : '')
  return (
    <nav className="roleswitch" aria-label="역할 전환">
      <NavLink to="/farmer" className={cls}>농가</NavLink>
      <NavLink to="/store" className={cls}>자영업자</NavLink>
    </nav>
  )
}
