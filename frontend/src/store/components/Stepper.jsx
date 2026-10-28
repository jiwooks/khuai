export default function Stepper({ value, onChange, min = 0, soft = false }) {
  const btn = soft ? { background: '#fff' } : undefined
  return (
    <div className="stepper" style={soft ? { background: 'var(--mint)' } : undefined}>
      <button style={btn} onClick={() => onChange(Math.max(min, value - 1))} aria-label="빼기">−</button>
      <span className="num">{value}</span>
      <button style={btn} onClick={() => onChange(value + 1)} aria-label="더하기">+</button>
    </div>
  )
}
