// 생산자 앱. 사용할 수 있는 API: backend/app/routers/farmer.py
//   GET   /api/farmer/farms                 농가 목록과 공급 정보
//   GET   /api/farmer/farms/{id}/requests   자영업자 주문에서 생긴 출하 요청
//   PATCH /api/farmer/requests/{id}         { status: "accepted" | "shipped" } → 자영업자 주문 단계도 같이 진행
//   PATCH /api/farmer/supplies/{id}         주간 생산량 / 출하 가능량 수정
//   GET   /api/farmer/demand                품목별 다음 주 예상 수요
import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { FruitIcon } from '../shared/Fruit.jsx'
import StatusBar from '../store/components/StatusBar.jsx'
import { FarmerProvider, useFarmer } from './FarmerContext.jsx'
import FarmerNav from './components/FarmerNav.jsx'
import Pick from './pages/Pick.jsx'
import Home from './pages/Home.jsx'
import LotNew from './pages/LotNew.jsx'
import Orders from './pages/Orders.jsx'
import Settlement from './pages/Settlement.jsx'

export default function FarmerApp() {
  return (
    <FarmerProvider>
      <Stage />
    </FarmerProvider>
  )
}

function Phone() {
  const { farmId, toastMsg } = useFarmer()
  const { pathname } = useLocation()
  const screen = useRef()
  useEffect(() => { screen.current?.scrollTo(0, 0) }, [pathname])

  const picking = pathname === '/farmer/pick'
  return (
    <div className="device">
      <StatusBar />
      <div className="screen" ref={screen}>
        {!farmId && !picking ? (
          <div className="empty">불러오는 중…</div>
        ) : (
          <Routes>
            <Route path="pick" element={<Pick />} />
            <Route index element={<Home />} />
            <Route path="lot/new" element={<LotNew />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settlement" element={<Settlement />} />
            <Route path="*" element={<Navigate to="/farmer" replace />} />
          </Routes>
        )}
      </div>
      {!picking && <FarmerNav />}
      <div className={`toast ${toastMsg ? '' : 'hide'}`} role="status">{toastMsg}</div>
    </div>
  )
}

function Stage() {
  return (
    <div className="stage">
      <aside className="side left">
        <div className="logo"><span className="logo-mark"><FruitIcon id="leaf" /></span><b>과일잇다</b></div>
        <h1>도매시장 경매 없이,<br /><em>받은 요청만</em><br />보면 됩니다</h1>
        <p>자영업자가 발주하면 AI가 농가를 골라 출하 요청을 만듭니다. 농가는 수락하고 출고하면 끝입니다.</p>
        <ul className="flow">
          <li className="app"><i />생산자 (영세 과일 농가)</li>
          <li className="cut"><i />도매시장 경매 · 가격 변동</li>
          <li className="cut"><i />중도매인 · 물류 거점</li>
          <li><i />과일잇다 앱 · 출하 요청과 정산</li>
          <li><i />자영업자 (카페·디저트·과일가게·주스바)</li>
        </ul>
      </aside>

      <div className="phone"><Phone /></div>

      <aside className="side">
        <div className="feat">
          <h3>생산자 앱 기능</h3>
          <ul>
            <li><b>출하 요청</b>: AI가 배정한 요청을 수락하고 출고 처리</li>
            <li><b>시세 비교</b>: 경매가 대비 정산가로 남는 금액 확인</li>
            <li><b>공급 현황</b>: 품목별 주간 생산량과 남은 출하 가능량</li>
            <li><b>수요 예측</b>: 다음 주 품목별 예상 수요로 출하 계획</li>
            <li><b>정산</b>: 수수료 사용처를 투명하게 공개</li>
          </ul>
        </div>
        <div className="feat">
          <h3>데모 사용법</h3>
          <ul>
            <li>오른쪽 위 버튼으로 자영업자 앱과 번갈아 볼 수 있습니다.</li>
            <li>요청을 수락하면 자영업자 주문 단계가 함께 올라갑니다.</li>
            <li>모든 수치는 데모용 가상 데이터입니다.</li>
          </ul>
        </div>
      </aside>

      <span className="deco d-left" style={{ width: 150, height: 150, left: -20, top: 40 }}><FruitIcon id="basket" /></span>
      <span className="deco" style={{ width: 120, height: 120, bottom: -10, right: 60 }}><FruitIcon id="pear" /></span>
      <span className="deco" style={{ width: 110, height: 110, top: 30, right: 20 }}><FruitIcon id="persim" /></span>
      <span className="deco d-left" style={{ width: 100, height: 100, bottom: 30, left: 20 }}><FruitIcon id="yuzu" /></span>
    </div>
  )
}
