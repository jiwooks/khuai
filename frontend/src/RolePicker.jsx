import { Link } from 'react-router-dom'

import Icon from './shared/Icon.jsx'
import { FruitIcon } from './shared/Fruit.jsx'
import StatusBar from './store/components/StatusBar.jsx'

export default function RolePicker() {
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

      <div className="phone">
        <div className="device">
          <StatusBar />
          <div className="screen">
            <div className="rolepick">
              <h2>과일잇다에<br />오신 것을 환영해요</h2>
              <p>어느 쪽으로 시작할까요?</p>

              <Link to="/farmer" className="role-card">
                <span className="im"><FruitIcon id="basket" /></span>
                <span>
                  <b>생산자(농가)</b>
                  <small>출하 요청을 받고 수락해요. 경매 없이 제값에 팝니다.</small>
                </span>
                <span className="go"><Icon name="arrow" size={16} /></span>
              </Link>

              <Link to="/store" className="role-card">
                <span className="im"><FruitIcon id="apple" /></span>
                <span>
                  <b>자영업자</b>
                  <small>필요한 과일을 AI 추천으로 발주해요.</small>
                </span>
                <span className="go"><Icon name="arrow" size={16} /></span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <aside className="side">
        <div className="feat">
          <h3>두 앱이 하나로 연결됩니다</h3>
          <ul>
            <li>자영업자가 발주하면 AI가 농가를 골라 <b>출하 요청</b>을 만듭니다.</li>
            <li>농가가 요청을 수락·출고하면 자영업자 <b>주문 단계가 함께 올라갑니다</b>.</li>
            <li>모든 수치는 데모용 가상 데이터입니다.</li>
          </ul>
        </div>
      </aside>

      <span className="deco d-left" style={{ width: 150, height: 150, left: -20, top: 40 }}><FruitIcon id="tang" /></span>
      <span className="deco" style={{ width: 120, height: 120, bottom: -10, right: 60 }}><FruitIcon id="kiwi" /></span>
      <span className="deco" style={{ width: 110, height: 110, top: 30, right: 20 }}><FruitIcon id="apple" /></span>
      <span className="deco d-left" style={{ width: 100, height: 100, bottom: 30, left: 20 }}><FruitIcon id="shine" /></span>
    </div>
  )
}
