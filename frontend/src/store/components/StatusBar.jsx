import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t) }, [])
  return (
    <div className="status">
      <span className="num">{now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}</span>
      <span className="ic" aria-hidden="true">
        <img src="/assets/figma/69b20.svg" alt="" />
        <img src="/assets/figma/5ff5b.svg" alt="" />
        <img src="/assets/figma/c69aa.svg" alt="" />
      </span>
    </div>
  )
}
