import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { FruitIcon } from '../shared/Fruit.jsx'
import { StoreProvider, useStore } from './StoreContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import Sheets from './components/Sheets.jsx'
import StatusBar from './components/StatusBar.jsx'
import Welcome from './pages/Welcome.jsx'
import Home from './pages/Home.jsx'
import Market from './pages/Market.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import AI from './pages/AI.jsx'

export default function StoreApp() {
  return (
    <StoreProvider>
      <Stage />
    </StoreProvider>
  )
}

function Phone() {
  const { storeId, toastMsg } = useStore()
  const { pathname } = useLocation()
  const screen = useRef()
  useEffect(() => { screen.current?.scrollTo(0, 0) }, [pathname])

  if (!storeId && pathname !== '/store/welcome') return <Navigate to="/store/welcome" replace />
  const welcome = pathname === '/store/welcome'
  return (
    <div className="device">
      <StatusBar />
      <div className="screen" ref={screen}>
        <Routes>
          <Route path="welcome" element={<Welcome />} />
          <Route index element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="ai" element={<AI />} />
          <Route path="*" element={<Navigate to="/store" replace />} />
        </Routes>
      </div>
      {!welcome && <BottomNav />}
      <Sheets />
      <div className={`toast ${toastMsg ? '' : 'hide'}`} role="status">{toastMsg}</div>
    </div>
  )
}

function Stage() {
  return (
    <div className="stage">
      <aside className="side left">
        <div className="logo"><span className="logo-mark"><FruitIcon id="leaf" /></span><b>과일잇다</b></div>
        <h1>산지 과일을<br /><em>우리 가게까지</em><br />바로 잇습니다</h1>
        <p>경매와 중도매 단계를 앱이 대신합니다. 생산자와 자영업자는 과일잇다 앱만 보고, 매칭은 AI가 합니다.</p>
        <ul className="flow">
          <li><i />생산자 (영세 과일 농가)</li>
          <li className="cut"><i />도매시장 경매</li>
          <li className="cut"><i />중도매인 · 물류 거점</li>
          <li className="app"><i />과일잇다 앱 · AI 수요예측과 농가 매칭</li>
          <li><i />자영업자 (카페·디저트·과일가게·주스바)</li>
        </ul>
      </aside>
      <div className="phone"><Phone /></div>
      <aside className="side">
        <div className="feat"><h3>자영업자 앱 기능</h3>
          <ul>
            <li><b>마켓</b>: 산지·수확 시각·등급과 도매 경유가 대비 할인율</li>
            <li><b>AI 발주</b>: 8주 주문 이력으로 다음 주 필요량 예측</li>
            <li><b>정기 발주</b>: 요일별 자동 주문, 농가는 고정 판로 확보</li>
            <li><b>AI 농가 매칭</b>: 품목·수량·거리·평점으로 농가 배정</li>
            <li><b>주문 추적</b>: 수확부터 매장 도착까지 단계별 표시</li>
            <li><b>AI 메뉴</b>: 이번 주 과일로 만들 신메뉴와 원가</li>
          </ul></div>
        <div className="feat"><h3>데모 사용법</h3>
          <ul><li>오른쪽 위 매장 아이콘을 누르면 카페·디저트·과일가게·주스바로 바뀝니다.</li>
            <li>과일 카드를 누르면 상세 정보가 열립니다.</li>
            <li>모든 수치는 데모용 가상 데이터입니다.</li></ul></div>
      </aside>
      <span className="deco d-left" style={{ width: 150, height: 150, left: -20, top: 40 }}><FruitIcon id="tang" /></span>
      <span className="deco" style={{ width: 120, height: 120, bottom: -10, right: 60 }}><FruitIcon id="kiwi" /></span>
      <span className="deco" style={{ width: 110, height: 110, top: 30, right: 20 }}><FruitIcon id="apple" /></span>
      <span className="deco d-left" style={{ width: 100, height: 100, bottom: 30, left: 20 }}><FruitIcon id="shine" /></span>
    </div>
  )
}
