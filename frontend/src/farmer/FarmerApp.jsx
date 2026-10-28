// 생산자 앱 (팀원 담당) — 여기서부터 개발하면 됩니다.
// 사용할 수 있는 API: backend/app/routers/farmer.py
//   GET   /api/farmer/farms                 농가 목록과 공급 정보
//   GET   /api/farmer/farms/{id}/requests   자영업자 주문에서 생긴 출하 요청
//   PATCH /api/farmer/requests/{id}         { status: "accepted" | "shipped" } → 자영업자 주문 단계도 같이 진행
//   PATCH /api/farmer/supplies/{id}         주간 생산량 / 출하 가능량 수정
//   GET   /api/farmer/demand                품목별 다음 주 예상 수요
import { Link } from 'react-router-dom'
import { FruitIcon } from '../shared/Fruit.jsx'

export default function FarmerApp() {
  return (
    <div style={{ maxWidth: 520, margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ width: 90, height: 90, margin: '0 auto 16px' }}><FruitIcon id="basket" /></div>
      <h2>생산자 앱 준비 중</h2>
      <p className="t2">농가 → 과일잇다 파트입니다. <code>frontend/src/farmer</code>에서 개발해 주세요.</p>
      <Link className="btn" to="/store">자영업자 앱 보기</Link>
    </div>
  )
}
