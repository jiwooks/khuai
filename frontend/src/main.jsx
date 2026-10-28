import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { SpriteDefs } from './shared/Fruit.jsx'
import RolePicker from './RolePicker.jsx'
import RoleSwitch from './RoleSwitch.jsx'
import StoreApp from './store/StoreApp.jsx'
import FarmerApp from './farmer/FarmerApp.jsx'
import './styles.css'

// MVP 데모: 진입하자마자 각 앱의 플로우를 보여주는 게 목적이라 매장 선택 단계를 건너뛴다.
// store/ 는 수정 금지이므로 StoreContext가 읽는 키를 미리 채워 두는 방식으로 처리한다.
// 선택 화면 자체는 남아 있어 헤더에서 매장을 바꿀 수 있다.
try {
  if (localStorage.getItem('gi.store') === null) localStorage.setItem('gi.store', JSON.stringify('cafe'))
} catch { /* 저장 불가 환경 무시 */ }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpriteDefs />
    <BrowserRouter>
      <RoleSwitch />
      <Routes>
        {/* 역할 선택 진입 */}
        <Route path="/" element={<RolePicker />} />
        {/* 자영업자 앱 (박보경) */}
        <Route path="/store/*" element={<StoreApp />} />
        {/* 생산자 앱 (팀원) */}
        <Route path="/farmer/*" element={<FarmerApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
