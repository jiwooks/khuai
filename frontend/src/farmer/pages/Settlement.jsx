import { won } from '../../shared/format.js'
import Character from '../../shared/Character.jsx'
import { LEGACY_FARMER_SHARE, PAST_SETTLEMENTS, SETTLEMENT } from '../mock.js'

export default function Settlement() {
  const farmerPercent = Math.round((1 - SETTLEMENT.feeRate) * 100)
  const platformPercent = Math.round(SETTLEMENT.feeRate * 100)
  // 43%는 데모용 가상 수치다. 실제 유통 통계가 아니므로 발표 자료에 실데이터로 쓰지 말 것.
  const legacyPercent = Math.round(LEGACY_FARMER_SHARE * 100)

  return (
    <>
      <div className="head-bar"><h2>정산</h2></div>

      <div className="farmer-price hero-green">
        <Character type="farmer" className="settlement-art" />
        <small>{SETTLEMENT.month}월 정산 예정액</small>
        <b className="num">{won(SETTLEMENT.expected)}원</b>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.28)', marginTop: 12, paddingTop: 10 }}>
          <small>{SETTLEMENT.month}월 {SETTLEMENT.payoutDay}일 입금 예정</small>
        </div>
      </div>

      <div className="sec"><h3>수수료는 이렇게 쓰여요</h3></div>
      <div className="farmer-settle glass pad">
        <div
          className="row"
          style={{ gap: 3, height: 14, borderRadius: 99, overflow: 'hidden' }}
        >
          <span style={{ width: `${farmerPercent}%`, height: '100%', background: 'var(--green)' }} />
          <span style={{ flex: 1, height: '100%', background: 'var(--mint-2)' }} />
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
          <span className="t1 num" style={{ color: 'var(--green-d)' }}>농가 {farmerPercent}%</span>
          <span className="t2 num">플랫폼 {platformPercent}%</span>
        </div>
        <div className="t2" style={{ marginTop: 12, lineHeight: 1.6 }}>
          기존 유통 구조에서는 소비자가 낸 금액의 {legacyPercent}%만 농가에 돌아갔어요.
        </div>
      </div>

      <div className="sec"><h3>월별 내역</h3></div>
      <div className="farmer-settle glass pad">
        {PAST_SETTLEMENTS.map((s) => (
          <div className="line" key={s.month}>
            <span>{s.month}월 · 완료</span>
            <span className="num">{won(s.amount)}원</span>
          </div>
        ))}
      </div>
    </>
  )
}
