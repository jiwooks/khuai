import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from '../../shared/Icon.jsx'
import { FruitIcon } from '../../shared/Fruit.jsx'
import Character from '../../shared/Character.jsx'
import { won } from '../../shared/format.js'
import { GRADES, HARVEST_DATE, QTY_PRESETS, VARIETIES } from '../mock.js'
import { useFarmer } from '../FarmerContext.jsx'
import { harvestLabel, priceOf } from '../utils.js'

const digits = (v) => Number(String(v).replace(/\D/g, '')) || 0

export default function LotNew() {
  const { farm, addLot, raiseSupply, toast } = useFarmer()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [fruitId, setFruitId] = useState('')
  const [variety, setVariety] = useState('')
  const [photos, setPhotos] = useState(false)
  const [grade, setGrade] = useState('')
  const [brix, setBrix] = useState(13)
  const [totalKg, setTotalKg] = useState(0)
  const [unitPrice, setUnitPrice] = useState(0)
  const [saving, setSaving] = useState(false)

  if (!farm) return <div className="empty">불러오는 중…</div>

  const supply = farm.supplies.find((s) => s.fruit_id === fruitId)
  const price = fruitId ? priceOf(fruitId) : null
  const ready = step === 1 ? fruitId && variety : step === 2 ? grade : totalKg > 0 && unitPrice > 0

  const back = () => (step > 1 ? setStep(step - 1) : navigate('/farmer'))

  const submit = async () => {
    if (step < 3) { setStep(step + 1); return }
    setSaving(true)
    try {
      addLot({ fruitId, variety, grade, brix, totalKg, unitPrice, harvestDate: HARVEST_DATE })
      if (supply) await raiseSupply(supply.id, supply.available_kg + totalKg)
      toast(`출하 등록 완료 · 출하 가능량이 ${totalKg}kg 늘었어요`)
      navigate('/farmer')
    } catch (e) {
      toast(e.message)
      setSaving(false)
    }
  }

  return (
    <div className="farmer-step">
      <div className="head-bar">
        <button className="back" onClick={back} aria-label="뒤로">
          <span aria-hidden="true">←</span>
        </button>
        <h2>출하 등록</h2>
        <button className="sub" onClick={() => navigate('/farmer')}>닫기</button>
      </div>

      <div className="row" style={{ gap: 6, marginBottom: 18 }}>
        {[1, 2, 3].map((n) => (
          <div className="progress-card grow" key={n}>
            <div className="bar" style={{ marginTop: 0 }}>
              <i style={{ width: n <= step ? '100%' : '0%' }} />
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>무엇을 출하하나요?</h3>

          <div className="t2" style={{ marginBottom: 8 }}>품목</div>
          <div className="opt">
            {farm.supplies.map((s) => (
              <button key={s.id} aria-pressed={fruitId === s.fruit_id} onClick={() => { setFruitId(s.fruit_id); setVariety('') }}>
                <span className="lot-fruit"><FruitIcon id={s.fruit_id} /></span>
                <b>{s.fruit}</b>
                주간 {s.weekly_capacity_kg}kg
              </button>
            ))}
          </div>

          {fruitId && (
            <>
              <div className="t2" style={{ margin: '18px 0 8px' }}>품종</div>
              <div className="chips">
                {(VARIETIES[fruitId] ?? []).map((v) => (
                  <button key={v} aria-pressed={variety === v} onClick={() => setVariety(v)}>{v}</button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>품질 등급을 알려주세요</h3>

          {photos ? (
            <div className="row" style={{ gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="fr-bg grow" style={{ background: 'var(--mint)', height: 72, padding: 12 }}>
                  <FruitIcon id={fruitId} />
                </span>
              ))}
            </div>
          ) : (
            <button className="glass pad" style={{ width: '100%', display: 'block', textAlign: 'left' }} onClick={() => setPhotos(true)}>
              <div className="row">
                <span className="fr-bg" style={{ background: 'var(--mint)', width: 44, height: 44, padding: 11, color: 'var(--green-d)', flex: 'none' }}>
                  <Icon name="camera" size={22} />
                </span>
                <div className="grow">
                  <div className="t1">수확 사진 등록</div>
                  <div className="t2">사진을 올리면 등급을 추천해 드려요</div>
                </div>
                <span className="ai-tag">AI</span>
              </div>
            </button>
          )}

          <div className="t2" style={{ margin: '18px 0 8px' }}>크기 등급</div>
          <div className="seg">
            {GRADES.map((g) => (
              <button key={g} aria-pressed={grade === g} onClick={() => setGrade(g)}>{g}</button>
            ))}
          </div>

          <div className="t2" style={{ margin: '18px 0 8px' }}>당도</div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="stepper">
              <button onClick={() => setBrix(Math.max(10, brix - 1))} aria-label="당도 낮추기">−</button>
              <span className="num" style={{ fontSize: 20, minWidth: 34 }}>{brix}</span>
              <button onClick={() => setBrix(Math.min(16, brix + 1))} aria-label="당도 높이기">+</button>
            </div>
            <span className="t2">Brix (10~16)</span>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>수량과 가격을 정해주세요</h3>

          <div className="t2" style={{ marginBottom: 8 }}>수확 예정일</div>
          <div className="glass pad row">
            <span style={{ color: 'var(--green-d)', display: 'grid' }}><Icon name="calendar" size={18} /></span>
            <span className="t1 num">{harvestLabel(HARVEST_DATE)}</span>
          </div>

          <div className="t2" style={{ margin: '18px 0 8px' }}>예상 수량</div>
          <div className="chips">
            {QTY_PRESETS.map((q) => (
              <button key={q} aria-pressed={totalKg === q} onClick={() => setTotalKg(q)} className="num">{q}kg</button>
            ))}
          </div>
          <div className="search" style={{ marginTop: 10 }}>
            <input
              inputMode="numeric"
              value={totalKg === 0 ? '' : totalKg}
              onChange={(e) => setTotalKg(digits(e.target.value))}
              placeholder="직접 입력"
              aria-label="예상 수량"
              className="num"
            />
            <span className="t2" style={{ paddingRight: 12 }}>kg</span>
          </div>

          <div className="t2" style={{ margin: '18px 0 8px' }}>희망 단가</div>
          <div className="search">
            <input
              inputMode="numeric"
              value={unitPrice === 0 ? '' : unitPrice}
              onChange={(e) => setUnitPrice(digits(e.target.value))}
              placeholder={price ? String(price.platform) : '0'}
              aria-label="희망 단가"
              className="num"
            />
            <span className="t2" style={{ paddingRight: 12 }}>원/kg</span>
          </div>
          {price && (
            <div className="t2 num" style={{ margin: '8px 2px 0' }}>
              과일잇다 평균 {won(price.platform)}원 · 오늘 경매가 {won(price.auction)}원
            </div>
          )}

          {totalKg > 0 && unitPrice > 0 && (
            <div className="glass pad" style={{ marginTop: 18 }}>
              <div className="t2 num">
                {variety} {supply?.fruit} {grade} · {brix}Brix · {totalKg}kg · {won(unitPrice)}원/kg
              </div>
              <div className="line total">
                <span>예상 수익</span>
                <span className="num">{won(totalKg * unitPrice)}원</span>
              </div>
            </div>
          )}
        </>
      )}

      <button className="btn block lg" style={{ marginTop: 22 }} disabled={!ready || saving} onClick={submit}>
        {step < 3 ? '다음' : saving ? '등록 중…' : '출하 등록하기'}
      </button>
      {step === 1 && <Character type="farmer" className="lot-art" />}
    </div>
  )
}
