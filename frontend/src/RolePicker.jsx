import { Link } from 'react-router-dom'

import Icon from './shared/Icon.jsx'
import { FruitIcon } from './shared/Fruit.jsx'
import StatusBar from './store/components/StatusBar.jsx'

export default function RolePicker() {
  return (
    <div className="stage farmer-stage">
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

      <span className="deco d-left" style={{ width: 150, height: 150, left: -20, top: 40 }}><FruitIcon id="tang" /></span>
      <span className="deco" style={{ width: 120, height: 120, bottom: -10, right: 60 }}><FruitIcon id="kiwi" /></span>
      <span className="deco" style={{ width: 110, height: 110, top: 30, right: 20 }}><FruitIcon id="apple" /></span>
      <span className="deco d-left" style={{ width: 100, height: 100, bottom: 30, left: 20 }}><FruitIcon id="shine" /></span>
    </div>
  )
}
