import { useSearchParams } from 'react-router-dom'

import { api } from '../../api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useLoad, useStore } from '../StoreContext.jsx'
import { SearchBar } from './Home.jsx'

const FILTERS = [['all', '전체'], ['mine', '우리 가게'], ['rising', '출하 증가'], ['ugly', 'B급·주스용']]

export default function Market() {
  const { storeId, version } = useStore()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const filter = params.get('filter') || 'all'
  const { data } = useLoad(() => api.fruits({ q, filter, store_id: storeId }), [q, filter, storeId, version])
  const set = (k, v) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }) }

  return (
    <>
      <div className="head-bar"><h2>과일 마켓</h2></div>
      <SearchBar key={q} initial={q} style={{ marginBottom: 12 }} />
      <div className="chips">
        {FILTERS.map(([id, label]) => (
          <button key={id} aria-pressed={filter === id} onClick={() => set('filter', id === 'all' ? '' : id)}>{label}</button>
        ))}
      </div>
      {q && (
        <div className="t2" style={{ margin: '10px 2px 0' }}>
          ‘{q}’ 검색 결과 {data?.length ?? 0}개
          <button onClick={() => set('q', '')} style={{ color: 'var(--green)', fontWeight: 700, marginLeft: 6 }}>지우기</button>
        </div>
      )}
      {!data ? <div className="empty">불러오는 중…</div> : data.length === 0 ? <div className="empty">해당하는 과일이 없어요</div> : (
        <div className="grid" style={{ marginTop: 12 }}>{data.map((f) => <ProductCard key={f.id} f={f} />)}</div>
      )}
      <p className="t2" style={{ margin: '14px 2px 0' }}>취소선 가격은 도매시장(경매·중도매)을 거친 소매 구매가 기준입니다.</p>
    </>
  )
}
