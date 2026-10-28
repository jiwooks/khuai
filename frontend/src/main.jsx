import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { SpriteDefs } from './shared/Fruit.jsx'
import StoreApp from './store/StoreApp.jsx'
import FarmerApp from './farmer/FarmerApp.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpriteDefs />
    <BrowserRouter>
      <Routes>
        {/* 자영업자 앱 (박보경) */}
        <Route path="/store/*" element={<StoreApp />} />
        {/* 생산자 앱 (팀원) */}
        <Route path="/farmer/*" element={<FarmerApp />} />
        <Route path="*" element={<Navigate to="/store" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
