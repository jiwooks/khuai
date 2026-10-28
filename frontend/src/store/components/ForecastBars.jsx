// 최근 8주 사용량(연한 막대) + 다음 주 예측(진한 막대와 말풍선)
export default function ForecastBars({ history, forecast, high }) {
  const W = 300, H = 96, n = history.length + 1, bw = 20
  const gap = (W - n * bw) / (n - 1)
  const vals = [...history, forecast]
  const max = Math.max(...vals, high) * 1.25
  const y = (v) => H - 16 - (v / max) * (H - 30)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="주간 사용량과 다음 주 예측">
      {vals.map((v, i) => {
        const x = i * (bw + gap)
        const last = i === n - 1
        return (
          <g key={i}>
            <rect x={x} y={y(v)} width={bw} height={H - 16 - y(v)} rx="7" fill={last ? 'var(--green)' : 'var(--mint-2)'} />
            {last && (
              <>
                <rect x={x + bw / 2 - 24} y={y(v) - 24} width="48" height="19" rx="9.5" fill="#1D2A24" />
                <text x={x + bw / 2} y={y(v) - 11} textAnchor="middle" style={{ fill: '#fff', fontWeight: 700 }}>{v.toFixed(1)}kg</text>
              </>
            )}
            <text x={x + bw / 2} y={H - 3} textAnchor="middle" style={last ? { fill: 'var(--green)', fontWeight: 700 } : undefined}>
              {last ? '다음주' : `${i - history.length}주`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
