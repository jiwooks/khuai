import { useState } from 'react'

import { timeLabel } from '../../shared/format.js'
import { useFarmer } from '../FarmerContext.jsx'
import { REQUEST_TABS, STATUS_LABEL, countByStatus, stepMessage } from '../utils.js'

export default function Orders() {
  const { requests, storeNames, updateRequest, toast } = useFarmer()
  const [tab, setTab] = useState('requested')
  const [busy, setBusy] = useState(null)

  if (!requests) return <div className="empty">불러오는 중…</div>

  const visible = requests.filter((r) => r.status === tab)

  const act = async (r, status) => {
    setBusy(r.id)
    try {
      const res = await updateRequest(r.id, status)
      toast(stepMessage(status, res.order_step))
    } catch (e) {
      toast(e.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <div className="head-bar"><h2>출하 요청</h2></div>

      <div className="seg">
        {REQUEST_TABS.map((t) => (
          <button
            key={t.status}
            aria-pressed={tab === t.status}
            onClick={() => setTab(t.status)}
          >
            {t.label} {countByStatus(requests, t.status)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty">해당하는 요청이 없어요</div>
      ) : (
        <div className="stack">
          {visible.map((r) => (
            <div className="farmer-request glass pad" key={r.id}>
              <div className="hd">
                <span className="pill">{r.fruit}</span>
                <span className={`st ${r.status === 'shipped' ? 'ok' : ''}`}>
                  {STATUS_LABEL[r.status]}
                </span>
                <span className="when num">{timeLabel(r.created_at)}</span>
              </div>

              <div className="t1">{storeNames[r.store_id] ?? r.store_id}</div>
              <div className="t2 num">주문번호 {r.order_code}</div>

              <div className="line total">
                <span>출하 수량</span>
                <span className="num">{r.kg}kg</span>
              </div>

              {r.status === 'requested' && (
                <button className="btn block" disabled={busy === r.id} onClick={() => act(r, 'accepted')}>
                  {busy === r.id ? '처리 중…' : '수락하기'}
                </button>
              )}
              {r.status === 'accepted' && (
                <button className="btn block soft" disabled={busy === r.id} onClick={() => act(r, 'shipped')}>
                  {busy === r.id ? '처리 중…' : '출고 완료'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
