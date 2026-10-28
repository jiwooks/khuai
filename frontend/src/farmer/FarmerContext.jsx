import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { api, farmerApi } from '../api.js'

const Ctx = createContext(null)
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* 저장 불가 환경 무시 */ } }

export function FarmerProvider({ children }) {
  const [farmId, setFarmIdRaw] = useState(() => load('gi.farm', null))
  const [farms, setFarms] = useState(null)
  const [requests, setRequests] = useState(null)
  const [storeNames, setStoreNames] = useState({})
  const [fruitNames, setFruitNames] = useState({})
  const [demand, setDemand] = useState(null)
  const [lots, setLots] = useState([])
  const [toastMsg, setToastMsg] = useState('')
  const [version, setVersion] = useState(0)
  const timer = useRef()

  useEffect(() => { farmerApi.farms().then(setFarms).catch(() => setFarms([])) }, [version])
  useEffect(() => { farmerApi.demand().then(setDemand).catch(() => setDemand([])) }, [version])

  // MVP 데모: 진입 시 농가를 고르게 하지 않고 첫 농가로 바로 들어간다.
  // 바꾸고 싶으면 /farmer/pick 에서 고를 수 있다.
  useEffect(() => {
    if (farmId == null && farms?.length) setFarmIdRaw(farms[0].id)
  }, [farms, farmId])

  // ShipmentRequest에는 가게명이 없고 store_id만 온다. demand는 fruit_id만 준다.
  useEffect(() => {
    api.stores().then((list) => setStoreNames(Object.fromEntries(list.map((s) => [s.id, s.name])))).catch(() => {})
    api.fruits().then((list) => setFruitNames(Object.fromEntries(list.map((f) => [f.id, f.name])))).catch(() => {})
  }, [])

  useEffect(() => {
    if (!farmId) return
    let alive = true
    farmerApi.requests(farmId).then((r) => alive && setRequests(r)).catch(() => alive && setRequests([]))
    return () => { alive = false }
  }, [farmId, version])

  const toast = useCallback((m) => {
    setToastMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(''), 2600)
  }, [])

  const setFarmId = useCallback((id) => {
    save('gi.farm', id)
    setFarmIdRaw(id)
    setRequests(null)
  }, [])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  const updateRequest = useCallback(async (id, status) => {
    const res = await farmerApi.updateRequest(id, { status })
    reload()
    return res
  }, [reload])

  const addLot = useCallback((lot) => {
    setLots((prev) => [...prev, { ...lot, id: `lot-${prev.length + 1}` }])
  }, [])

  // 백엔드에 Lot 모델이 없다. 등록한 물량은 공급의 출하 가능량으로 반영해 둔다.
  const raiseSupply = useCallback(async (supplyId, availableKg) => {
    await farmerApi.updateSupply(supplyId, { available_kg: availableKg })
    reload()
  }, [reload])

  const farm = useMemo(() => farms?.find((f) => f.id === farmId) ?? null, [farms, farmId])

  const value = useMemo(() => ({
    farmId, setFarmId, farm, farms, requests, demand, storeNames, fruitNames,
    lots, addLot, raiseSupply, updateRequest, reload, toast, toastMsg,
  }), [farmId, setFarmId, farm, farms, requests, demand, storeNames, fruitNames,
    lots, addLot, raiseSupply, updateRequest, reload, toast, toastMsg])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useFarmer = () => useContext(Ctx)
