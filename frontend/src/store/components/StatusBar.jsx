import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  return (
    <div className="status">
      <span className="num">{now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}</span>
      <span className="ic"><span style={{ width: 16, height: 9 }} /><span style={{ width: 4, height: 9, opacity: 0.5 }} /><span style={{ width: 22, height: 11, borderRadius: 3 }} /></span>
    </div>
  )
}
