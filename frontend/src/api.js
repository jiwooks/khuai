// 백엔드 API 호출 모음. 개발 중에는 Vite가 /api 를 FastAPI(8000)로 프록시합니다.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.detail || '요청을 처리하지 못했어요')
  return data
}

export const api = {
  stores: () => request('/stores'),
  store: (sid) => request(`/stores/${sid}`),
  home: (sid) => request(`/stores/${sid}/home`),
  fruits: (params = {}) => request(`/fruits?${new URLSearchParams(params)}`),
  fruit: (id) => request(`/fruits/${id}`),
  forecast: (sid) => request(`/stores/${sid}/forecast`),
  menuIdeas: (sid) => request(`/stores/${sid}/menu-ideas`),
  subscriptions: (sid) => request(`/stores/${sid}/subscriptions`),
  createSubscription: (sid, body) => request(`/stores/${sid}/subscriptions`, { method: 'POST', body }),
  updateSubscription: (id, body) => request(`/subscriptions/${id}`, { method: 'PATCH', body }),
  deleteSubscription: (id) => request(`/subscriptions/${id}`, { method: 'DELETE' }),
  orders: (sid) => request(`/stores/${sid}/orders`),
  createOrder: (sid, body) => request(`/stores/${sid}/orders`, { method: 'POST', body }),
  advanceOrder: (code) => request(`/orders/${code}/advance`, { method: 'POST' }),
  reviewOrder: (code, body) => request(`/orders/${code}/review`, { method: 'POST', body }),
}

export const farmerApi = {
  farms: () => request('/farmer/farms'),
  requests: (farmId) => request(`/farmer/farms/${farmId}/requests`),
  updateRequest: (id, body) => request(`/farmer/requests/${id}`, { method: 'PATCH', body }),
  updateSupply: (id, body) => request(`/farmer/supplies/${id}`, { method: 'PATCH', body }),
  demand: () => request('/farmer/demand'),
}
