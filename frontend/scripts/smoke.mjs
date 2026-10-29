// Read-only checks against the existing Vite → FastAPI proxy. No test data is written.
import assert from 'node:assert/strict'

const base = process.env.FRONTEND_URL || 'http://127.0.0.1:5173'
let count = 0
async function get(path, check) {
  const response = await fetch(`${base}/api${path}`)
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`)
  assert.match(response.headers.get('content-type') || '', /application\/json/, `${path}: expected JSON`)
  const data = await response.json()
  check(data)
  console.log(`PASS ${path}`)
  count++
  return data
}

await get('/health', (d) => assert.equal(d.ok, true))
const stores = await get('/stores', (d) => assert.ok(Array.isArray(d) && d.length > 0))
const fruits = await get('/fruits', (d) => assert.ok(Array.isArray(d) && d.every((f) => f.id && Number.isFinite(f.price))))
const store = encodeURIComponent(stores[0].id)
await get(`/stores/${store}`, (d) => assert.equal(d.id, stores[0].id))
await get(`/stores/${store}/home`, (d) => assert.ok(Array.isArray(d.recommendations)))
await get(`/fruits/${encodeURIComponent(fruits[0].id)}`, (d) => assert.ok(Array.isArray(d.candidates) && Array.isArray(d.also)))
await get(`/stores/${store}/orders`, (d) => assert.ok(Array.isArray(d) && d.every((o) => Array.isArray(o.timeline))))
await get(`/stores/${store}/forecast`, (d) => assert.ok(Array.isArray(d) && d.every((f) => Array.isArray(f.history) && Number.isFinite(f.forecast_kg))))
await get(`/stores/${store}/subscriptions`, (d) => assert.ok(Array.isArray(d.items) && Number.isFinite(d.monthly_kg)))
await get(`/stores/${store}/menu-ideas`, (d) => assert.ok(Array.isArray(d) && d.every((m) => Array.isArray(m.fruit_ids))))
const farms = await get('/farmer/farms', (d) => assert.ok(Array.isArray(d) && d.length > 0 && d.every((f) => Array.isArray(f.supplies))))
await get(`/farmer/farms/${farms[0].id}/requests`, (d) => assert.ok(Array.isArray(d) && d.every((r) => ['requested', 'accepted', 'shipped'].includes(r.status))))
await get('/farmer/demand', (d) => assert.ok(Array.isArray(d) && d.every((f) => Number.isFinite(f.forecast_kg))))
console.log(`\n${count} API/proxy checks passed.`)
