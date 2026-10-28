import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api.js'

const Ctx = createContext(null)
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* 저장 불가 환경 무시 */ } }

export function StoreProvider({ children }) {
  const [storeId, setStoreIdRaw] = useState(() => load('gi.store', null))
  const [store, setStore] = useState(null)
  const [cart, setCart] = useState(() => load('gi.cart', {}))
  const [fruits, setFruits] = useState({}) // id → 과일 정보 (장바구니 표시용)
  const [toastMsg, setToastMsg] = useState('')
  const [sheet, setSheet] = useState(null) // { type: 'product'|'store'|'review', ... }
  const [version, setVersion] = useState(0) // 데이터 변경 시 화면 새로고침용
  const timer = useRef()

  useEffect(() => { api.fruits().then((list) => setFruits(Object.fromEntries(list.map((f) => [f.id, f])))) }, [version])
  useEffect(() => { if (storeId) api.store(storeId).then(setStore).catch(() => setStoreIdRaw(null)) }, [storeId])
  useEffect(() => save('gi.cart', cart), [cart])

  const toast = useCallback((m) => {
    setToastMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(''), 2000)
  }, [])

  const setStoreId = useCallback((id) => {
    save('gi.store', id)
    setStoreIdRaw(id)
    setCart({})
  }, [])

  const addToCart = useCallback((id, n = 1) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + n })), [])
  const setQty = useCallback((id, n) => setCart((c) => {
    const next = { ...c }
    if (n <= 0) delete next[id]
    else next[id] = n
    return next
  }), [])

  const value = useMemo(() => ({
    storeId, store, setStoreId, cart, setCart, addToCart, setQty, fruits,
    toast, toastMsg, sheet, setSheet, version, refresh: () => setVersion((v) => v + 1),
    cartCount: Object.values(cart).reduce((a, b) => a + b, 0),
  }), [storeId, store, setStoreId, cart, addToCart, setQty, fruits, toast, toastMsg, sheet, version])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

// 간단한 데이터 로딩 훅
export function useLoad(fn, deps) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    let alive = true
    setError(null)
    fn().then((d) => alive && setData(d)).catch((e) => alive && setError(e.message))
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, error, setData }
}
